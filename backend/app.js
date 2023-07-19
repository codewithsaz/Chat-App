require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const roomRoutes = require("./routes/room");

const User = require("./models/User");
const Chat = require("./models/Chats");
const Room = require("./models/Room");
const UserRoom = require("./models/UserRoom");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    // methods: ['GET', 'POST', 'PUT','DELETE'],
  })
);
app.use(express.json());

app.use(userRoutes);
app.use(roomRoutes);
app.use(chatRoutes);

User.belongsToMany(Room, { through: "UserRoom" });
Room.belongsToMany(User, { through: "UserRoom" });

Room.hasMany(Chat);
Chat.belongsTo(Room);

User.hasMany(Chat);
Chat.belongsTo(User);

UserRoom.belongsTo(User);
UserRoom.belongsTo(Room);

sequelize
  // .sync()
  .sync({ force: false })
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
