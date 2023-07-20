const Sequelize = require("sequelize");
// const User = require("./models/User");

const sequelize = require("../util/database");
const Room = sequelize.define("rooms", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    // autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  iconURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  single: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

// Room.belongsToMany(User, { through: "UserRoom" });

module.exports = Room;
