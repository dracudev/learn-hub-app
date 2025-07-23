let express = require("express");
let app = express();
let path = require("path");
require("dotenv").config({ path: "./.env" });

// Add express-session
const session = require("express-session");

// Import database connection
const connection = require("./src/config/database");

// Import routes
const routes = require("./src/routes/index");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

app.listen(process.env.PORT);
console.log("Server listening on port " + process.env.PORT);

// Close connection when app terminates
process.on("SIGINT", () => {
  connection.end();
});
