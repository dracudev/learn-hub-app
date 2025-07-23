const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const requireAdmin = require("../middlewares/requireAdmin");
const { courseValidation } = require("../validations/courseValidation");

// Course CRUD routes (admin only)
router.get("/courses/create", requireAdmin, courseController.getCreate);

router.post(
  "/courses/create",
  courseValidation,
  requireAdmin,
  courseController.postCreate
);

router.get("/courses/:id/edit", requireAdmin, courseController.getEdit);

router.post(
  "/courses/:id/edit",
  courseValidation,
  requireAdmin,
  courseController.postEdit
);

router.post("/courses/:id/delete", requireAdmin, courseController.delete);

// Public routes for viewing courses
router.get("/courses", courseController.getAll);
router.get("/courses/:id", courseController.getDetails);

module.exports = router;
