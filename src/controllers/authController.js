const connection = require("../config/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

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
      const results = await query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (results.length > 0) {
        return res.render("signup", {
          title: "Sign Up",
          message: "Email already exists.",
          user: req.session.user,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "registered"]
      );

      res.redirect("/login");
    } catch (err) {
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
      const results = await query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (results.length === 0) {
        return res.render("login", {
          title: "Login",
          message: "Invalid email or password.",
          user: req.session.user,
        });
      }

      const isMatch = await bcrypt.compare(password, results[0].password);

      if (!isMatch) {
        return res.render("login", {
          title: "Login",
          message: "Invalid email or password.",
          user: req.session.user,
        });
      }

      req.session.user = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        role: results[0].role,
        profile_picture: results[0].profile_picture,
      };
      res.redirect("/");
    } catch (err) {
      res.render("login", {
        title: "Login",
        message: "Error during login.",
        user: req.session.user,
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};

module.exports = authController;
