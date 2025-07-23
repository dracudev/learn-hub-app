const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const courseRoutes = require("./courseRoutes");

// Home route
router.get("/", function (req, res) {
  let message;
  if (req.session.user) {
    message = `Welcome, ${req.session.user.name}!`;
  } else {
    message = "You are not logged in.";
  }
  res.render("home", {
    title: "Home page",
    message: message,
    user: req.session.user,
  });
});

// Use route modules
router.use("/", authRoutes);
router.use("/", adminRoutes);
router.use("/", courseRoutes);

module.exports = router;
