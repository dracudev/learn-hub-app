const { exec } = require("child_process");

async function deploy() {
  try {
    console.log("🚀 Starting deployment...");

    // Run migrations
    console.log("📦 Running database migrations...");
    await new Promise((resolve, reject) => {
      exec("npx sequelize-cli db:migrate", (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Migration error:", error);
          reject(error);
        } else {
          console.log("✅ Migrations completed successfully");
          if (stdout) console.log(stdout);
          resolve();
        }
      });
    });

    // Check if database needs seeding by checking multiple tables
    console.log("🔍 Checking if database needs initial data...");
    const needsSeeding = await new Promise((resolve) => {
      // Check users table first (most critical)
      exec(
        `mysql -h "${process.env.MYSQL_HOST || process.env.DB_HOST}" -P ${
          process.env.MYSQL_PORT || process.env.DB_PORT || 3306
        } -u "${process.env.MYSQL_USER || process.env.DB_USER}" -p"${
          process.env.MYSQL_PASSWORD || process.env.DB_PASS
        }" "${
          process.env.MYSQL_DATABASE || process.env.DB_NAME
        }" -e "SELECT COUNT(*) as count FROM users;" --skip-column-names --silent`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(
              "⚠️  Cannot check users table (likely doesn't exist yet), will seed"
            );
            console.log("Error details:", error.message);
            resolve(true); // Seed if we can't check
          } else {
            const userCount = parseInt(stdout.trim()) || 0;
            console.log(`📊 Found ${userCount} users in database`);

            // If no users, definitely need seeding
            if (userCount === 0) {
              resolve(true);
            } else {
              // Check courses table too for completeness
              exec(
                `mysql -h "${
                  process.env.MYSQL_HOST || process.env.DB_HOST
                }" -P ${
                  process.env.MYSQL_PORT || process.env.DB_PORT || 3306
                } -u "${process.env.MYSQL_USER || process.env.DB_USER}" -p"${
                  process.env.MYSQL_PASSWORD || process.env.DB_PASS
                }" "${
                  process.env.MYSQL_DATABASE || process.env.DB_NAME
                }" -e "SELECT COUNT(*) as count FROM courses;" --skip-column-names --silent`,
                (courseError, courseStdout) => {
                  const courseCount = parseInt(courseStdout?.trim()) || 0;
                  console.log(`📚 Found ${courseCount} courses in database`);

                  // Only seed if both users AND courses are empty
                  resolve(userCount === 0 && courseCount === 0);
                }
              );
            }
          }
        }
      );
    });

    // Run seeders only if database is empty
    if (needsSeeding) {
      console.log("🌱 Database appears empty, running seeders...");
      console.log("   - Creating demo users (admin@admin.com, user@user.com)");
      console.log("   - Creating sample courses");
      console.log("   - Creating demo enrollments");

      await new Promise((resolve, reject) => {
        exec("npx sequelize-cli db:seed:all", (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Seeder error:", error);
            // Don't reject - seeders failing shouldn't stop deployment
            console.log("⚠️  Continuing deployment despite seeder issues...");
            resolve();
          } else {
            console.log("✅ Sample data created successfully!");
            console.log("👤 Demo users:");
            console.log("   - Admin: admin@admin.com / admin");
            console.log("   - User: user@user.com / user");
            if (stdout) console.log(stdout);
            resolve();
          }
        });
      });
    } else {
      console.log("📋 Database has existing data, skipping seeders");
    }

    // Start the app
    console.log("🎯 Starting application...");
    console.log("🌐 App will be available shortly...");
    require("../../app.js");
  } catch (error) {
    console.error("💥 Deployment failed:", error);
    console.error("🔍 Check the logs above for details");
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
