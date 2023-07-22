const upload = require("../helpers/upload.helper");
const util = require("util");

exports.uploadMediaToDB = async (req, res) => {
  console.log(req.file.location);

  const fileURL = req.file.location;
  const date = req.body.date;
  const type = req.body.type;
  const roomID = req.body.roomID;
  try {
    await req.user.createChatDb({
      name: req.user.name,
      message: fileURL,
      date: date,
      type: type,
      roomId: roomID,
    });
    res.status(200).json({
      succes: true,
      message: "Message Added to Database",
      chat: { name: req.user.name, message: fileURL, date: date, type: type },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Unable to add chat to DataBase" });
  }
};
