const express = require("express");

const router = express.Router();

const roomController = require("../controllers/room");
const authenticator = require("../middlewares/authenticator");

router.get("/group/get", authenticator.authenticate, roomController.getRooms);
router.get(
  "/group/:groupId/users",
  authenticator.authenticate,
  roomController.getUsersInAGroup
);

router.post(
  "/group/add",
  authenticator.authenticate,
  roomController.createRoom
);

router.post(
  "/group/:roomId/addUser",
  authenticator.authenticate,
  roomController.addUserToRoom
);

router.delete(
  "/group/:roomId/deleteUser/:userIds",
  authenticator.authenticate,
  roomController.deleteUserFromRoom
);

router.get(
  "/group/:roomId/makeAdmin/:userIds",
  authenticator.authenticate,
  roomController.updateUserToAdmin
);

module.exports = router;
