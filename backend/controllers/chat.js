const ChatDB = require("../models/Chats");

exports.addChatToDB = async (req, res) => {
  const message = req.body.message;
  // console.log(message, req.user);
  try {
    await req.user.createChatDb({
      name: req.user.name,
      message: message,
    });
    res.status(200).json({
      succes: true,
      message: "Message Added to Database",
      chat: { name: req.user.name, message: message },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Unable to add chat to DataBase" });
  }
};

exports.getChatsFromDb = async (req, res) => {
  try {
    const chats = await ChatDB.findAll();
    // console.log(chats);
    res.status(200).json({
      succes: true,
      chats: chats,
    });
    res;
  } catch (err) {
    console.log(err);
  }
};
