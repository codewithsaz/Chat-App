const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Participants = sequelize.define("Participants", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Participants;
