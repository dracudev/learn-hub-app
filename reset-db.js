const mysql = require("mysql2/promise");
require("dotenv").config();

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log("🗑️  Dropping database...");
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

    console.log("🆕 Creating fresh database...");
    await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);

    console.log("✅ Database reset successfully!");
    console.log("Now run: npm run db:migrate && npm run db:seed");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await connection.end();
  }
}

resetDatabase();
