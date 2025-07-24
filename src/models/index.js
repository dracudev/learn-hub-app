const database = require("../../database");

const models = database.getModels();

module.exports = {
  sequelize: database.orm || require("../../database/config/sequelize"),
  User: models.User,
  Course: models.Course,
  Enrollment: models.Enrollment,
};
