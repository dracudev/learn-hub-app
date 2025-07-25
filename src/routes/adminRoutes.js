const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/dashboard", function (req, res, next) {
  return courseController.list(req, res);
});

module.exports = router;
