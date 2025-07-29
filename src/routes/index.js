const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const courseRoutes = require("./courseRoutes");
const userRoutes = require("./userRoutes");
const { requireAdmin, jwtAuth } = require("../middleware/auth");

router.get("/", function (req, res) {
  let message;
  if (req.session.user) {
    message = `Welcome, ${req.session.user.name}!`;
  } else {
    message = "You are not logged in.";
  }
  res.render("home", {
    title: "Home",
    message: message,
    user: req.session.user,
  });
});

router.use("/auth", authRoutes);
router.use("/admin", jwtAuth, requireAdmin, adminRoutes);
router.use("/courses", courseRoutes);
router.use("/user", jwtAuth, userRoutes);

module.exports = router;
