const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const courseRoutes = require("./courseRoutes");
const userRoutes = require("./userRoutes");
const { requireAdmin, requireAuth } = require("../middleware/auth");

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
router.use("/admin", requireAdmin, adminRoutes);
router.use("/courses", courseRoutes);
router.use("/user", requireAuth, userRoutes);

module.exports = router;
