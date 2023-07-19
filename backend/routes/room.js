const express = require("express");

const router = express.Router();

const roomController = require("../controllers/room");
const authenticator = require("../middlewares/authenticator");

router.get("/group/get", authenticator.authenticate, roomController.getRooms);

router.post(
  "/group/add",
  authenticator.authenticate,
  roomController.createRoom
);

module.exports = router;
