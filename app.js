require("dotenv").config({ path: "./.env" });
const app = require("./src/server");
const database = require("./database");

// Database connection and local server start
async function startServer() {
  try {
    await database.connect();
    const port = process.env.PORT || 3000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server listening on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down gracefully...");
  await database.disconnect();
  process.exit(0);
});
