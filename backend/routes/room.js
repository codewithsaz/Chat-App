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

router.post(
  "/group/addUser",
  authenticator.authenticate,
  roomController.addUserToRoom
);

router.delete(
  "/group/deleteUser",
  authenticator.authenticate,
  roomController.deleteUserFromRoom
);

module.exports = router;
