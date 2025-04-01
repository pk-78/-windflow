const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Db connected successfully");
    })
    .catch((err) => {
      console.log("Connection error", err);
      console.error(err);
      process.exit(1);
    });
};

module.exports = dbconnect;
