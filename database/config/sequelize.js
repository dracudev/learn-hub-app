const { Sequelize } = require("sequelize");
const SequelizeModelFactory = require("../factories/SequelizeModelFactory");
const schemas = require("../schemas");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",
    protocol: "postgres",
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
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      define: {
        timestamps: true,
        underscored: false,
      },
    }
  );
}

const modelFactory = new SequelizeModelFactory(sequelize);

const User = modelFactory.createModel("User", schemas.User);
const Course = modelFactory.createModel("Course", schemas.Course);
const Enrollment = modelFactory.createModel("Enrollment", schemas.Enrollment);

modelFactory.setupAssociations(schemas.getAll());

module.exports = sequelize;
