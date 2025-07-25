const { exec } = require("child_process");

async function deploy() {
  try {
    // Run migrations
    console.log("Running migrations...");
    await new Promise((resolve, reject) => {
      exec("npx sequelize-cli db:migrate", (error, stdout, stderr) => {
        if (error) {
          console.error("Migration error:", error);
          reject(error);
        } else {
          console.log("Migrations completed:", stdout);
          resolve();
        }
      });
    });

    // Check if database needs seeding
    console.log("Checking if database needs seeding...");
    const needsSeeding = await new Promise((resolve) => {
      // Check if any table has data (example: users table)
      exec(
        "mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e 'SELECT COUNT(*) as count FROM users;' --skip-column-names",
        (error, stdout, stderr) => {
          if (error) {
            console.log(
              "Error checking tables or tables don't exist yet, will seed:",
              error.message
            );
            resolve(true); // Seed if we can't check
          } else {
            const count = parseInt(stdout.trim());
            console.log(`Found ${count} records in users table`);
            resolve(count === 0); // Seed only if empty
          }
        }
      );
    });

    // Run seeders only if database is empty
    if (needsSeeding) {
      console.log("Database appears empty, running seeders...");
      await new Promise((resolve, reject) => {
        exec("npx sequelize-cli db:seed:all", (error, stdout, stderr) => {
          if (error) {
            console.error("Seeder error:", error);
            reject(error);
          } else {
            console.log("Seeders completed:", stdout);
            resolve();
          }
        });
      });
    } else {
      console.log("Database has data, skipping seeders");
    }

    // Start the app
    console.log("Starting application...");
    require("../../app.js");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

deploy();
