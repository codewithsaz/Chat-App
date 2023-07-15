const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const authenticator = require("../middlewares/authenticator");

router.post("/user/signup", userController.addUser);

router.post("/user/login", userController.verifyUser);

// router.post("/user/updatePassword", userController.updatePassword);

// router.get(
//   "/user/premium",
//   authenticator.authenticate,
//   userController.isPremiumUser
// );

module.exports = router;
