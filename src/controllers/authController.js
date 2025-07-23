const connection = require("../config/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.getSignup = (req, res) => {
  res.render("signup", {
    title: "Sign Up",
    message: "",
    user: req.session.user,
  });
};

exports.postSignup = (req, res) => {
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
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (err, results) {
      if (err) {
        return res.render("signup", {
          title: "Sign Up",
          message: "Database error.",
          user: req.session.user,
        });
      }
      if (results.length > 0) {
        return res.render("signup", {
          title: "Sign Up",
          message: "Email already exists.",
          user: req.session.user,
        });
      }

      // Hash the password before storing
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.render("signup", {
            title: "Sign Up",
            message: "Error processing password.",
            user: req.session.user,
          });
        }

        connection.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, "registered"],
          function (err2) {
            if (err2) {
              return res.render("signup", {
                title: "Sign Up",
                message: "Error creating user.",
                user: req.session.user,
              });
            }
            res.redirect("/login");
          }
        );
      });
    }
  );
};

exports.getLogin = (req, res) => {
  res.render("login", {
    title: "Login",
    message: "",
    user: req.session.user,
  });
};

exports.postLogin = (req, res) => {
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
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (err, results) {
      if (err) {
        return res.render("login", {
          title: "Login",
          message: "Database error.",
          user: req.session.user,
        });
      }
      if (results.length === 0) {
        return res.render("login", {
          title: "Login",
          message: "Invalid email or password.",
          user: req.session.user,
        });
      }

      // Compare the provided password with the hashed password
      bcrypt.compare(password, results[0].password, (compareErr, isMatch) => {
        if (compareErr) {
          return res.render("login", {
            title: "Login",
            message: "Error during login.",
            user: req.session.user,
          });
        }

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
        };
        res.redirect("/");
      });
    }
  );
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
