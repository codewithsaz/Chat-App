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
