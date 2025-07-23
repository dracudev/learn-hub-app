const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect(function (error) {
  if (error) {
    console.error("Database connection failed:", error);
    throw error;
  } else {
    console.log("Connected to database");
  }
});

module.exports = connection;