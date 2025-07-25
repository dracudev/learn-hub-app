const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../validations/authValidation");

router.get("/signup", authController.getSignup);
router.post("/signup", signupValidation, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", loginValidation, authController.postLogin);

router.get("/logout", authController.logout);

module.exports = router;
