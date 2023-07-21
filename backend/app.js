require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const roomRoutes = require("./routes/room");
const fileRoutes = require("./routes/file");

const User = require("./models/Users");
const Chat = require("./models/Chats");
const Room = require("./models/Room");
const UserRoom = require("./models/UserRoom");

app.use(
  cors({
    origin: "*",
    // methods: ['GET', 'POST', 'PUT','DELETE'],
  })
);
app.use(express.json());

app.use(userRoutes);
app.use(roomRoutes);
app.use(chatRoutes);
app.use(fileRoutes);

User.belongsToMany(Room, { through: "userroom" });
Room.belongsToMany(User, { through: "userroom" });

UserRoom.belongsTo(User);
UserRoom.belongsTo(Room);

Room.hasMany(Chat);
Chat.belongsTo(Room);

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
  // .sync()
  .sync({ force: false })
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
