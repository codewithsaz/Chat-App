// require("dotenv").config();
const User = require("../models/User");
// const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

function generateAccessToken(id, name, isPremiumUser) {
  return jwt.sign(
    { userId: id, name: name, isPremiumUser: isPremiumUser },
    process.env.SECRET_KEY
  );
}

//adding new User
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
  User.findAll({
    where: {
      email: email,
    },
  })
    .then((user) => {
      // console.log(user[0]);
      bcrypt.compare(password, user[0].password, function (err, result) {
        if (result)
          res.status(200).json({
            success: true,
            p3245uouhdosuhgf: user[0].id,
            sdthhtxyd436: user[0].name,
            message: "Login Successfull",
            token: generateAccessToken(
              user[0].id,
              user[0].name,
              user[0].isPremiumUser
            ),
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

exports.isPremiumUser = (req, res) => {
  if (req.user.isPremiumUser) {
    res.status(201).json({ isValid: true });
  } else {
    res.status(201).json({ isValid: false });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({});
    // console.log(users);
    res.status(201).json({ users: users });
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
