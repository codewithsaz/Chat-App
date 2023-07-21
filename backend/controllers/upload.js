const upload = require("../helpers/upload.helper");
const util = require("util");

exports.uploadSingle = async (req, res) => {
  console.log(req.file.location);

  const fileURL = req.file.location;
  const date = req.body.date;
  const type = req.body.type;
  const roomID = req.body.roomID;
  // console.log(message, roomID, type, date);
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

  // req.file contains a file object
  // res.json(req.file);
};

// exports.uploadMultiple = (req, res) => {
//   // req.files contains an array of file object
//   res.json(req.files);
// };

// exports.uploadSingleV2 = async (req, res) => {
//   const uploadFile = util.promisify(upload.single("file"));
//   try {
//     await uploadFile(req, res);
//     res.json(req.file);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
