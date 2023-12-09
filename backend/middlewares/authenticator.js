// require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const sequelize = require("../util/database");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userEmail = jwt.verify(token, process.env.SECRET_KEY).email;
    const user = await User.findOne({ where: { email: userEmail } });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};

exports.findUserEmail = async (req, res, next) => {
  try {
    const requestID = req.params.requestID;
    const requestUser = await ForgotPasswordRequest.findByPk(requestID, {
      where: { isActive: true },
    });
    // console.log("requestUser", requestUser.userEmail);
    req.user = requestUser;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};
