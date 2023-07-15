require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const sequelize = require("../util/database");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userId = jwt.verify(token, process.env.SECRET_KEY).userId;
    const user = await User.findByPk(userId);

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

// exports.validateUser = async (req, res, next) => {
//   const email = req.body.email;
//   try {
//     const user = await User.findOne({
//       where: {
//         email: email,
//       },
//     });
//     if (user === null) {
//       res.status(500).json({
//         success: false,
//         message: "Your are not a registered user!",
//       });
//     } else {
//       req.user = user;
//       next();
//     }
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Cant validate user now",
//     });
//   }
// };

// exports.validateUserMembership = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization");
//     const userId = jwt.verify(token, process.env.SECRET_KEY).userId;
//     const user = await User.findByPk(userId, {
//       where: { isPremiumUser: true },
//     });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({ success: false });
//   }
// };

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
