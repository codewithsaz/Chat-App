const cron = require("node-cron");
const { Sequelize } = require("sequelize");
const sequelize = require("./util/database");

const Chat = require("./models/Chats");
const ArchivedChat = require("./models/ArchivedChat");

// Cron job to run every night at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    console.log(oneDayAgo);

    const oneDayOldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: oneDayAgo,
        },
      },
    });

    for (const chat of oneDayOldChats) {
      await ArchivedChat.create({
        message: chat.message,
        createdAt: chat.createdAt,
      });
    }

    await Chat.destroy({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: oneDayAgo,
        },
      },
    });

    console.log("Archiving and deletion process completed successfully!");
  } catch (error) {
    console.error("Error occurred during archiving and deletion:", error);
  }
});

// Start the cron job
// cron.start();
