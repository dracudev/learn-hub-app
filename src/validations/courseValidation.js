const { body } = require("express-validator");

exports.courseValidation = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("visibility")
    .isIn(["public", "private"])
    .withMessage("Visibility must be either public or private."),
];
