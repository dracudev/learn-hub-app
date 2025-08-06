const app = require("../src/server");
const database = require("../database");

(async () => {
  try {
    await database.connect();
    console.log("✅ Database connected for serverless function");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

module.exports = app;
