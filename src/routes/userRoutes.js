const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile", userController.showProfile);
router.post("/enroll/:courseId", userController.enrollCourse);
router.post("/unenroll/:courseId", userController.unenrollCourse);

module.exports = router;
