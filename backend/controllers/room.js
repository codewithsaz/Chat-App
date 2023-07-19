const Room = require("../models/Room");
const User = require("../models/User");

exports.createRoom = async (req, res) => {
  try {
    const { groupName, imageURL, users } = req.body;

    // Create the group
    const group = await Room.create({
      name: groupName,
      iconURL: imageURL,
      single: false,
    });

    // Find the selected users
    const selectedUsers = await User.findAll({
      where: { id: users },
    });

    // Add the selected users to the group
    await group.addUsers(selectedUsers);

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

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is an admin of the room
    const adminUserRoom = await UserRoom.findOne({
      where: { UserId: adminId, RoomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can add users to the room" });
    }

    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ error: "One or more users not found" });
    }

    // Create records in UserRoom for each user added to the room
    await Promise.all(
      users.map(async (user) => {
        await UserRoom.create({
          UserId: user.id,
          RoomId: roomId,
          admin: false, // New users are not admins by default
        });
      })
    );

    res.status(200).json({ message: "Users added to the room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add users to the room" });
  }
};

exports.deleteUserFromRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIds } = req.body;
    const adminId = req.user.id; // Assuming you have the admin's user ID in req.user

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is an admin of the room
    const adminUserRoom = await UserRoom.findOne({
      where: { UserId: adminId, RoomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can remove users from the room" });
    }

    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ error: "One or more users not found" });
    }

    // Remove users from the room by deleting their UserRoom records
    await Promise.all(
      users.map(async (user) => {
        await UserRoom.destroy({ where: { UserId: user.id, RoomId: roomId } });
      })
    );

    res
      .status(200)
      .json({ message: "Users removed from the room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove users from the room" });
  }
};
