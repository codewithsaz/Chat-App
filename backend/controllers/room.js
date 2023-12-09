const Room = require("../models/Room");
const User = require("../models/Users");
const UserRoom = require("../models/UserRoom");

exports.createGroupRoom = async (req, res) => {
  try {
    const { groupName, imageURL, users } = req.body;
    console.log("users", users);

    const group = await Room.create({
      name: groupName,
      iconURL:
        imageURL.length > 0
          ? imageURL
          : "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png",
      roomType: "GROUP",
    });

    const selectedUsers = await User.findAll({
      where: { email: users },
    });
    console.log("selectedUsers", selectedUsers);
    await group.addParticipants(selectedUsers);

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
exports.createPersonalRoom = async (req, res) => {
  const { user } = req.body;
  try {
    console.log("users", user);
    const selectedUsers = await User.findOne({
      where: { email: user },
    });

    const group = await Room.create({
      name: selectedUsers.name + "_" + req.user.name,
      iconURL:
        "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png",
      roomType: "PERSONAL",
    });

    console.log("selectedUsers", selectedUsers);
    await group.addParticipants(selectedUsers);

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
exports.createPrivateRoom = async (req, res) => {
  const { user } = req.body;
  try {
    console.log("users", user);
    const selectedUsers = await User.findOne({
      where: { email: user },
    });

    const group = await Room.create({
      name: selectedUsers.name + "_" + req.user.name,
      iconURL:
        "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png",
      roomType: "PRIVATE",
    });

    console.log("selectedUsers", selectedUsers);
    await group.addParticipants(selectedUsers);

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
exports.getGroupRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.findAll({
      attributes: ["id", "name", "iconURL", "roomType"],
      where: { roomType: "GROUP" },
      include: [
        {
          model: User,
          attributes: [],
          where: { id: userId },
          through: { attributes: [] },
          as: "participants",
        },
      ],
    });
    res.status(200).json({ groups: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
};
exports.getPrivateRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.findAll({
      attributes: ["id", "name", "iconURL", "roomType"],
      where: { roomType: "PRIVATE" },
      include: [
        {
          model: User,
          attributes: [],
          where: { id: userId },
          through: { attributes: [] },
          as: "participants",
        },
      ],
    });
    res.status(200).json({ groups: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
};
exports.getPersonalRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.findAll({
      // attributes: ["id", "name", "iconURL", "roomType"],
      where: { roomType: "PERSONAL" },
      include: [
        {
          model: User,
          attributes: [],
          where: { id: userId },
          through: { attributes: [] },
          as: "participants",
        },
        {
          model: User,
          attributes: ["name", "profileIconURL"],
          through: { attributes: [] },
          as: "participants", // Use a different alias for the second User model
        },
      ],
    });
    res.status(200).json({ groups: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
};
exports.getGroupRoomDetails = async (req, res) => {
  const groupID = req.params.groupId;
  try {
    const userId = req.user.id;
    const rooms = await Room.findOne({
      attributes: ["name", "iconURL"],
      where: { id: groupID, roomType: "GROUP" },
    });
    console.log("room details", rooms);
    res.status(200).json({ success: true, group: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
};

exports.getPersonalRoomDetails = async (req, res) => {
  const groupID = req.params.groupId;
  try {
    const userId = req.user.id;
    const rooms = await Room.findOne({
      attributes: ["name", "iconURL"],
      where: { id: groupID, roomType: "PERSONAL" },
    });
    console.log("room details", rooms);
    res.status(200).json({ success: true, group: rooms });
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
    const room = await Room.findOne({
      where: { roomId: roomId, roomType: "GROUP" },
    });
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
        as: "participants",
      },
    });
    const admins = usersInGroup.filter((user) => user.admin === true);
    const nonAdmins = usersInGroup.filter((user) => user.admin === false);

    res
      .status(200)
      .json({ success: true, adminsInGroup: admins, usersInGroup: nonAdmins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users from the group" });
  }
};
