const express = require("express");
const router = express.Router();

const upload = require("../helpers/upload.helper");
const uploadController = require("../controllers/upload");
const authenticator = require("../middlewares/authenticator");

router.post(
  "/chat/upload",
  authenticator.authenticate,
  upload.single("message"),
  uploadController.uploadMediaToDB
);

module.exports = router;
