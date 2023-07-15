const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");
const authenticator = require("../middlewares/authenticator");

router.post(
  "/chat/add",
  authenticator.authenticate,
  chatController.addChatToDB
);

module.exports = router;
