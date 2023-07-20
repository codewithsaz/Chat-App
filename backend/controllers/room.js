const Room = require("../models/Room");
const User = require("../models/User");
const UserRoom = require("../models/UserRoom");

exports.createRoom = async (req, res) => {
  try {
    const { groupName, imageURL, users } = req.body;

    // Create the group
    const group = await Room.create({
      name: groupName,
      iconURL: imageURL,
      single: false,
    });

    const selectedUsers = await User.findAll({
      where: { id: users },
    });

    await group.addUsers(selectedUsers);

    const roomId = group.id;
    console.log(roomId, req.user.id);
    const userRoom = await UserRoom.findOne({
      where: { userId: req.user.id, roomId: roomId },
    });

    console.log("userRoom", userRoom);
    if (!userRoom) {
      await UserRoom.create({
        userId: req.user.id,
        roomId: roomId,
        admin: true,
      });
    } else {
      await UserRoom.update({ admin: true });
    }

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// async (req, res) => {
//   try {
//     const { name } = req.body;
//     const room = await Room.create({ name, iconURL, isSingle });
//     res.status(201).json(room);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create room" });
//   }
// },
// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user ID available in req.user

    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] }, // Exclude the join table attributes from the result
        },
      ],
    });
    // console.log(rooms);
    res.status(200).json({ groups: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
};
// async (req, res) => {
//   try {
//     const rooms = await Room.findAll();
//     res.status(200).json({ groups: rooms });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve rooms" });
//   }
// };

exports.addUserToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIds } = req.body;
    const adminId = req.user.id; // Assuming you have the admin's user ID in req.user
    console.log(roomId, userIds);
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is an admin of the room
    const adminUserRoom = await UserRoom.findOne({
      where: { userId: adminId, roomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can add users to the room" });
    }

    const user = await User.findOne({ where: { id: userIds } });
    if (user) {
      await UserRoom.create({
        userId: user.id,
        roomId: roomId,
        admin: false, // New users are not admins by default
      });

      res.status(200).json({ message: "Users added to the room successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add users to the room" });
  }
};

exports.deleteUserFromRoom = async (req, res) => {
  try {
    const { roomId, userIds } = req.params;
    console.log(roomId, userIds);
    // const { userIds } = req.body;
    const adminId = req.user.id; // Assuming you have the admin's user ID in req.user

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is an admin of the room
    const adminUserRoom = await UserRoom.findOne({
      where: { userId: adminId, roomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can remove users from the room" });
    }

    const user = await User.findOne({ where: { id: userIds } });
    if (user) {
      await UserRoom.destroy({ where: { userId: userIds, roomId: roomId } });
      res.status(200).json({
        success: true,
        message: "Users removed from the room successfully",
      });
    }

    // Remove users from the room by deleting their UserRoom records
    // await Promise.all(
    //   users.map(async (user) => {
    //     await UserRoom.destroy({ where: { UserId: user.id, RoomId: roomId } });
    //   })
    // );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to remove users from the room" });
  }
};

exports.updateUserToAdmin = async (req, res) => {
  try {
    const { roomId, userIds } = req.params;
    // const { userIds } = req.body;
    const adminId = req.user.id; // Assuming you have the admin's user ID in req.user

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is an admin of the room
    const adminUserRoom = await UserRoom.findOne({
      where: { userId: adminId, roomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can update users to admin status" });
    }

    const user = await User.findOne({ where: { id: userIds } });
    console.log("User found : ", user, " userID : ", user.id);
    if (user) {
      const userRoom = await UserRoom.findOne({
        where: { userId: user.id, roomId: roomId },
      });

      if (!userRoom) {
        throw new Error("No user room found");
      } else {
        // If the user is already in the room, update their admin status to true

        await userRoom.update({ admin: true });
      }
      res.status(200).json({
        success: true,
        message: "Users updated to admin status in the room successfully",
      });
    }

    // await Promise.all(
    //   users.map(async (user) => {
    //     const userRoom = await UserRoom.findOne({
    //       where: { UserId: user.id, RoomId: roomId },
    //     });

    //     // If the user is not in the room, add them to the room as admin
    //     if (!userRoom) {
    //       await UserRoom.create({
    //         UserId: user.id,
    //         RoomId: roomId,
    //         admin: true,
    //       });
    //     } else {
    //       // If the user is already in the room, update their admin status to true
    //       await userRoom.update({ admin: true });
    //     }
    //   })
    // );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to update users to admin status in the room" });
  }
};

exports.getUsersInAGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    console.log(groupId);

    const usersInGroup = await UserRoom.findAll({
      where: { roomId: groupId },
      include: {
        model: User,
        attributes: ["id", "name"], // Include only id and name attributes from
      }, // Include the User model to fetch user details
    });

    res.status(200).json(usersInGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users from the group" });
  }
};
