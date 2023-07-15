require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");

const User = require("./models/user");

app.use(cors());
app.use(express.json());

app.use(userRoutes);

// User.hasMany(Expense);
// Expense.belongsTo(User);

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
