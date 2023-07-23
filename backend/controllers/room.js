const Room = require("../models/Room");
const User = require("../models/Users");
const UserRoom = require("../models/UserRoom");

exports.createRoom = async (req, res) => {
  try {
    const { groupName, imageURL, users } = req.body;

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

    // console.log("userRoom", userRoom);
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
exports.getRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] },
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

exports.addUserToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIds } = req.body;
    const adminId = req.user.id;
    // console.log(roomId, userIds);
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

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
        admin: false,
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
    // console.log(roomId, userIds);
    const adminId = req.user.id;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to remove users from the room" });
  }
};

exports.updateUserToAdmin = async (req, res) => {
  try {
    const { roomId, userIds } = req.params;
    const adminId = req.user.id;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    const adminUserRoom = await UserRoom.findOne({
      where: { userId: adminId, roomId: roomId },
    });
    if (!adminUserRoom || !adminUserRoom.admin) {
      return res
        .status(403)
        .json({ error: "Only admins can update users to admin status" });
    }

    const user = await User.findOne({ where: { id: userIds } });
    // console.log("User found : ", user, " userID : ", user.id);
    if (user) {
      const userRoom = await UserRoom.findOne({
        where: { userId: user.id, roomId: roomId },
      });

      if (!userRoom) {
        throw new Error("No user room found");
      } else {
        await userRoom.update({ admin: true });
      }
      res.status(200).json({
        success: true,
        message: "Users updated to admin status in the room successfully",
      });
    }
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
    // console.log(groupId);

    const usersInGroup = await UserRoom.findAll({
      where: { roomId: groupId },
      include: {
        model: User,
        attributes: ["id", "name"],
      },
    });

    res.status(200).json(usersInGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users from the group" });
  }
};
