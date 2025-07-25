let express = require("express");
let app = express();
let path = require("path");
require("dotenv").config({ path: "./.env" });

const { configureSession } = require("./src/middleware/session");
const database = require("./database");
const routes = require("./src/routes/index");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(configureSession());

// Routes
app.use("/", routes);

// Database connection
async function startServer() {
  try {
    const sequelize = await database.connect();
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
