const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const UserRoom = sequelize.define("UserRoom", {
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = UserRoom;
