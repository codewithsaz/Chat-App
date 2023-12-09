// require("dotenv").config();
const User = require("../models/Users");
// const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const sequelize = require("../util/database");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

function generateAccessToken(email, name) {
  return jwt.sign({ email: email, name: name }, process.env.SECRET_KEY);
}

exports.addUser = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    User.create({
      name: name,
      email: email,
      phone: phone,
      password: hash,
      isPremiumUser: false,
    })
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "User Created",
        });
      })
      .catch((err) => {
        console.log("User already exists\n" + err);
        res.status(404).json({
          success: false,
          message: "User already exists",
        });
      });
    if (err)
      res.status(404).json({
        success: false,
        message: "Cant register at the moment",
      });
  });
};

exports.verifyUser = (req, res) => {
  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      // console.log(user, user.name, user.id, user.email);
      bcrypt.compare(password, user.password, function (err, result) {
        if (result)
          res.status(200).json({
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              profileIconURL: user.profileIconURL,
            },
            p3245uouhdosuhgf: user.id,
            sdthhtxyd436: user.name,
            message: "Login Successfull",
            token: generateAccessToken(user.email, user.name),
          });
        else
          res.status(401).json({
            success: false,
            message: "Invalid Credentials",
          });
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    });
};
exports.getUserDetails = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userEmail = jwt.verify(token, process.env.SECRET_KEY).email;
    const user = await User.findOne({ where: { email: userEmail } });
    if (user)
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileIconURL: user.profileIconURL,
        },
      });
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "User Not Found" });
  }
};

exports.getAllUser = async (req, res) => {
  const currentUser = req.user;
  try {
    const users = await User.findAll({
      attributes: ["name", "email", "profileIconURL"],
      where: {
        id: {
          [Sequelize.Op.not]: currentUser.id, // Exclude the current user by using the not operator
        },
      },
    });
    res.status(201).json({ success: true, users: users });
  } catch (err) {
    res.status(201).json({ isValid: false });
  }
};

// exports.updatePassword = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const t = await sequelize.transaction();
//   try {
//     let FRP_UUID_validate = await ForgotPasswordRequest.findOne({
//       where: { userEmail: email, isActive: true },
//     });
//     // console.log("FRP_UUID_validate ", FRP_UUID_validate);
//     if (FRP_UUID_validate != null) {
//       const user = await User.findOne({ where: { email: email } });
//       // console.log(user);
//       if (user !== null) {
//         bcrypt.hash(password, saltRounds, async function (err, hash) {
//           try {
//             await user.update({ password: hash }, { transaction: t });
//             const FPR_status = await ForgotPasswordRequest.findOne({
//               where: { userEmail: email },
//             });
//             await FPR_status.update({ isActive: false }, { transaction: t });
//             await t.commit();
//             res.status(201).json({ message: "Password Updated" });
//           } catch (err) {
//             console.log(err);
//             await t.rollback();
//             res.status(500).json({
//               success: false,
//               message: "Password updation failed",
//             });
//           }
//         });
//       }
//     } else {
//       res.status(500).json({
//         success: false,
//         message: "Link has expired",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "User not found",
//     });
//   }
// };
