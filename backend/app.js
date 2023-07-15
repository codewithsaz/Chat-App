require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

const User = require("./models/user");
const Chat = require("./models/chat-db");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    // methods: ['GET', 'POST', 'PUT','DELETE'],
  })
);
app.use(express.json());

app.use(userRoutes);
app.use(chatRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgotPasswordRequest);
// ForgotPasswordRequest.belongsTo(User);

// User.hasMany(ReportGenerated);
// ReportGenerated.belongsTo(User);

sequelize
  .sync()
  // .sync({ force: true })
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
