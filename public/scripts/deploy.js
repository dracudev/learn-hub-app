const { exec } = require("child_process");
const { Sequelize } = require("sequelize");

async function deploy() {
  try {
    console.log("🚀 Starting deployment...");

    process.env.NODE_ENV = "production";

    console.log("🔍 Environment check:");
    console.log("POSTGRES_URL:", process.env.POSTGRES_URL ? "SET" : "NOT_SET");

    const sequelize = new Sequelize(process.env.POSTGRES_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    });

    await sequelize.authenticate();
    console.log("✅ Database connection successful!");

    console.log("📦 Running migrations...");
    await new Promise((resolve, reject) => {
      exec(
        "npx sequelize-cli db:migrate --env production",
        { env: { ...process.env, NODE_ENV: "production" } },
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

    console.log("🔍 Checking if database needs seeding...");
    try {
      const [results] = await sequelize.query(
        "SELECT COUNT(*) as count FROM users"
      );
      const userCount = results[0].count;
      console.log(`📊 Found ${userCount} users in database`);

      if (userCount === 0) {
        console.log("🌱 Database appears empty, running seeders...");
        await new Promise((resolve, reject) => {
          exec(
            "npx sequelize-cli db:seed:all --env production",
            { env: { ...process.env, NODE_ENV: "production" } },
            (error, stdout, stderr) => {
              if (error) {
                console.error("⚠️ Seeder error (non-critical):", error.message);
                resolve();
              } else {
                console.log("✅ Sample data created successfully!");
                console.log("👤 Demo users:");
                console.log("   - Admin: admin@admin.com / admin");
                console.log("   - User: user@user.com / user");
                resolve();
              }
            }
          );
        });
      } else {
        console.log("📋 Database has existing data, skipping seeders");
      }
    } catch (seedError) {
      console.log("⚠️ Could not check for existing data, skipping seeders");
    }

    console.log("🎯 Starting application...");
    require("../../app.js");
  } catch (error) {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  }
}

deploy();
