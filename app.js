let express = require("express");
let app = express();
let path = require("path");
require("dotenv").config({ path: "./.env" });

// Add express-session
const session = require("express-session");

// Import abstracted database layer
const database = require("./database");

// Import routes
const routes = require("./src/routes/index");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Use routes
app.use("/", routes);

// Database connection (abstracted)
async function startServer() {
  try {
    const sequelize = await database.connect();

    // DISABLED: Sync database (causing too many constraints)
    // Use migrations instead: npm run db:migrate
    // if (process.env.NODE_ENV !== "production") {
    //   await sequelize.sync({ alter: true });
    //   console.log("Database synced successfully.");
    // }

    app.listen(process.env.PORT, () => {
      console.log("Server listening on port " + process.env.PORT);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();

// Close connection when app terminates
process.on("SIGINT", async () => {
  await database.disconnect();
  process.exit(0);
});
