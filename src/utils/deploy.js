#!/usr/bin/env node

const database = require("../../database");

async function deployProduction() {
  try {
    console.log("🚀 Starting production deployment...");

    // Test database connection
    console.log("📡 Testing database connection...");
    const sequelize = await database.connect();
    console.log("✅ Database connection established successfully.");

    // Run migrations
    console.log("🔄 Running database migrations...");
    const { execSync } = require("child_process");

    try {
      execSync("npx sequelize-cli db:migrate", {
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" },
      });
      console.log("✅ Migrations completed successfully.");
    } catch (error) {
      console.error("❌ Migration failed:", error.message);
      throw error;
    }

    // Optionally seed the database (be careful in production)
    if (process.argv.includes("--seed")) {
      console.log("🌱 Seeding database...");
      try {
        execSync("npx sequelize-cli db:seed:all", {
          stdio: "inherit",
          env: { ...process.env, NODE_ENV: "production" },
        });
        console.log("✅ Database seeded successfully.");
      } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        throw error;
      }
    }

    console.log("🎉 Production deployment completed successfully!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Set NODE_ENV=production");
    console.log("2. Start the application with: npm start");
    console.log("");
  } catch (error) {
    console.error("💥 Production deployment failed:", error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

// Handle command line arguments
if (require.main === module) {
  deployProduction();
}

module.exports = deployProduction;
