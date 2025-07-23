const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Admin dashboard (now accessible at /admin/dashboard)
router.get("/dashboard", function (req, res, next) {
  return courseController.list(req, res);
});

module.exports = router;
