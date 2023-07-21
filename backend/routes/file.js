const express = require("express");

const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("message"), (req, res) => {
  const name = req.body.name;
  const roomID = req.body.roomID;
  const file = req.file;

  // Process the name, roomID, and file as needed (e.g., save to database, send to other clients, etc.)
  // Your logic goes here...

  res.json({ message: "Message and File uploaded successfully!" });
});

module.exports = router;
