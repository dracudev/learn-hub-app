Users\andre\Desktop\dracudev\IronHack\course-catalog\public\scripts\deploy.js
const { exec } = require("child_process");
const { Sequelize } = require('sequelize');

async function deploy() {
  try {
    console.log("🚀 Starting deployment...");
    process.env.NODE_ENV = "production";

    // Debug environment
    console.log("🔍 Environment variables:");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT_SET");
    console.log("MYSQL_HOST:", process.env.MYSQL_HOST || "NOT_SET");

    // Test direct database connection
    console.log("🔌 Testing direct database connection...");
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: console.log
    });

    try {
      await sequelize.authenticate();
      console.log("✅ Database connection successful!");
      
      // Run migrations programmatically
      const { Umzug, SequelizeStorage } = require('umzug');
      const umzug = new Umzug({
        migrations: {
          glob: 'database/migrations/*.js',
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });

      console.log("📦 Running migrations programmatically...");
      await umzug.up();
      console.log("✅ Migrations completed!");

    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
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

deploy();