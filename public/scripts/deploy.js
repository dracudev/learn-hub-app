const { exec } = require("child_process");
const { Sequelize } = require("sequelize");

async function deploy() {
  try {
    console.log("🚀 Starting deployment...");
    process.env.NODE_ENV = "production";

    // Debug environment
    console.log("🔍 Environment variables:");
    console.log("MYSQL_URL:", process.env.MYSQL_URL ? "SET" : "NOT_SET");
    console.log("MYSQLHOST:", process.env.MYSQLHOST || "NOT_SET");

    // Test direct database connection using MYSQL_URL
    console.log("🔌 Testing direct database connection...");
    const sequelize = new Sequelize(process.env.MYSQL_URL, {
      dialect: "mysql",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false, // Disable SQL logging for cleaner output
    });

    try {
      await sequelize.authenticate();
      console.log("✅ Database connection successful!");

      // Run migrations programmatically with correct import
      console.log("📦 Running migrations programmatically...");

      const { Umzug } = require("umzug");
      const { SequelizeStorage } = require("umzug");

      const umzug = new Umzug({
        migrations: {
          glob: "database/migrations/*.js",
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });

      await umzug.up();
      console.log("✅ Migrations completed!");

      // Check if database needs seeding
      console.log("🔍 Checking if database needs seeding...");

      const [results] = await sequelize.query(
        "SELECT COUNT(*) as count FROM users"
      );
      const userCount = results[0].count;
      console.log(`📊 Found ${userCount} users in database`);

      if (userCount === 0) {
        console.log("🌱 Database appears empty, running seeders...");

        // Create seeder umzug instance
        const seederUmzug = new Umzug({
          migrations: {
            glob: "database/seeders/*.js",
          },
          context: sequelize.getQueryInterface(),
          storage: new SequelizeStorage({
            sequelize,
            tableName: "SequelizeData", // Different table for seeders
          }),
          logger: console,
        });

        await seederUmzug.up();
        console.log("✅ Sample data created successfully!");
        console.log("👤 Demo users:");
        console.log("   - Admin: admin@admin.com / admin");
        console.log("   - User: user@user.com / user");
      } else {
        console.log("📋 Database has existing data, skipping seeders");
      }
    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError);
      throw dbError;
    }

    // Start the app
    console.log("🎯 Starting application...");
    require("../../app.js");
  } catch (error) {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});

deploy();
