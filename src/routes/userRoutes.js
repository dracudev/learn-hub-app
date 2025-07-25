const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { uploadSingle } = require("../middleware/upload");

router.get("/profile", userController.showProfile);
router.post("/enroll/:courseId", userController.enrollCourse);
router.post("/unenroll/:courseId", userController.unenrollCourse);
router.post(
  "/profile/picture",
  uploadSingle,
  userController.updateProfilePicture
);

module.exports = router;
