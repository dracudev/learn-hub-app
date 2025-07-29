const { User } = require("../models");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { signJwt } = require("../utils/jwt");

const authController = {
  getSignup: (req, res) => {
    res.render("signup", {
      title: "Sign Up",
      message: "",
      user: req.session.user,
    });
  },

  postSignup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup", {
        title: "Sign Up",
        message: errors
          .array()
          .map((e) => e.msg)
          .join(" "),
        user: req.session.user,
      });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render("signup", {
        title: "Sign Up",
        message: "Please fill in all fields.",
        user: req.session.user,
      });
    }

    try {
      const existingUser = await models.User.findFirst({
        where: { email },
      });

      if (existingUser) {
        return res.render("signup", {
          title: "Sign Up",
          message: "Email already exists.",
          user: req.session.user,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await models.User.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "registered",
        },
      });

      const userPayload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
      req.session.user = userPayload;
      const token = signJwt(userPayload);
      req.session.jwt = token;
      res.redirect("/");
    } catch (err) {
      console.error("Error creating user:", err);
      res.render("signup", {
        title: "Sign Up",
        message: "Error creating user.",
        user: req.session.user,
      });
    }
  },

  getLogin: (req, res) => {
    res.render("login", {
      title: "Login",
      message: "",
      user: req.session.user,
    });
  },

  postLogin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        title: "Login",
        message: errors
          .array()
          .map((e) => e.msg)
          .join(" "),
        user: req.session.user,
      });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("login", {
        title: "Login",
        message: "Please fill in all fields.",
        user: req.session.user,
      });
    }

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.render("login", {
          title: "Login",
          message: "Invalid email or password.",
          user: req.session.user,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("login", {
          title: "Login",
          message: "Invalid email or password.",
          user: req.session.user,
        });
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      };

      const token = signJwt({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      req.session.jwt = token;
      res.redirect("/");
    } catch (err) {
      console.error("Error during login:", err);
      res.render("login", {
        title: "Login",
        message: "Error during login.",
        user: req.session.user,
      });
    }
  },

  logout: (req, res) => {
    req.session = null;
    res.redirect("/");
  },
};
module.exports = authController;
