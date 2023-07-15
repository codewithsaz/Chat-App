const ChatDB = require("../models/chat-db");

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
