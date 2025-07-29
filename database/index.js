// Database Abstraction Layer

class DatabaseAdapter {
  constructor() {
    this.orm = null;
    this.models = {};
  }

  async connect() {
    const sequelize = require("./config/sequelize");
    this.orm = sequelize;

    await this.orm.authenticate();
    console.log("Database connected successfully.");
    return this.orm;
  }

  async disconnect() {
    if (this.orm && this.orm.close) {
      console.log("Closing database connection...");
      await this.orm.close();
    }
  }

  getModels() {
    const sequelize = require("./config/sequelize");

    return {
      User: sequelize.models.User,
      Course: sequelize.models.Course,
      Enrollment: sequelize.models.Enrollment,
    };
  }

  async runMigrations() {
    console.log("Use: npm run db:migrate");
  }

  async seedDatabase() {
    console.log("Use: npm run db:seed");
  }
}

module.exports = new DatabaseAdapter();
