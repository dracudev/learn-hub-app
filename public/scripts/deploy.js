const { exec } = require("child_process");
const { Sequelize } = require("sequelize");

async function deploy() {
  try {
    console.log("🚀 Starting deployment...");
    process.env.NODE_ENV = "production";

    console.log("🔍 Environment check:");
    console.log("MYSQL_URL:", process.env.MYSQL_URL ? "SET" : "NOT_SET");

    // Test database connection
    const sequelize = new Sequelize(process.env.MYSQL_URL, {
      dialect: "mysql",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    });

    await sequelize.authenticate();
    console.log("✅ Database connection successful!");

    // Run migrations using CLI (simpler approach)
    console.log("📦 Running migrations...");
    await new Promise((resolve, reject) => {
      exec(
        "NODE_ENV=production npx sequelize-cli db:migrate",
        (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Migration error:", error);
            reject(error);
          } else {
            console.log("✅ Migrations completed!");
            resolve();
          }
        }
      );
    });

    // Start the app
    console.log("🎯 Starting application...");
    require("../../app.js");
  } catch (error) {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  }
}

deploy();
