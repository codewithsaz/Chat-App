const express = require("express");

const router = express.Router();

const roomController = require("../controllers/room");
const authenticator = require("../middlewares/authenticator");

router.get(
  "/group/get",
  authenticator.authenticate,
  roomController.getGroupRooms
);
router.get(
  "/personal/get",
  authenticator.authenticate,
  roomController.getPersonalRooms
);
router.get(
  "/private/get",
  authenticator.authenticate,
  roomController.getPrivateRooms
);
router.get(
  "/group/:groupId/users",
  authenticator.authenticate,
  roomController.getUsersInAGroup
);
router.get(
  "/group/:groupId/details",
  authenticator.authenticate,
  roomController.getGroupRoomDetails
);
router.get(
  "/personal/:groupId/details",
  authenticator.authenticate,
  roomController.getPersonalRoomDetails
);

router.post(
  "/group/add",
  authenticator.authenticate,
  roomController.createGroupRoom
);
router.post(
  "/personal/add",
  authenticator.authenticate,
  roomController.createPersonalRoom
);
router.post(
  "/private/add",
  authenticator.authenticate,
  roomController.createPrivateRoom
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
