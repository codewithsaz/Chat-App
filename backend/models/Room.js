const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Room = sequelize.define("Room", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Room.belongsToMany(User, { through: "UserRoom" });

module.exports = Room;
