const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const authenticator = require("../middlewares/authenticator");

router.post("/user/signup", userController.addUser);

router.post("/user/login", userController.verifyUser);

router.get("/user/all", authenticator.authenticate, userController.getAllUser);

// router.post("/user/updatePassword", userController.updatePassword);

module.exports = router;
