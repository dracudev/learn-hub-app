const express = require("express");
const path = require("path");
const { configureSession } = require("./middleware/session");
const { helmetMiddleware, limiter } = require("./middleware/security");
const routes = require("./routes/index");

const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(configureSession());
app.use(helmetMiddleware);
app.use(limiter);

// Routes
app.use("/", routes);

module.exports = app;
