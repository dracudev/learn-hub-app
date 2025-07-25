require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + "_test",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.MYSQL_USER || process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASS,
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
    host: process.env.MYSQL_HOST || process.env.DB_HOST,
    port: process.env.MYSQL_PORT || process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
