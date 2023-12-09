const Sequelize = require("sequelize");
// const User = require("./models/User");

const sequelize = require("../util/database");
const Room = sequelize.define("rooms", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  iconURL: {
    type: Sequelize.STRING,
    defaultValue:
      "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png",
    allowNull: false,
  },
  roomType: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [["PERSONAL", "PRIVATE", "GROUP"]],
    },
  },
});

// Room.belongsToMany(User, { through: "UserRoom" });

module.exports = Room;
