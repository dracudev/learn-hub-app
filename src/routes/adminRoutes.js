const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Administration route (list courses)
router.get("/administration", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (req.session.user.role === "admin") {
    return courseController.list(req, res);
  } else {
    return res.redirect("/");
  }
});

module.exports = router;
