const connection = require("../config/database");
const { validationResult } = require("express-validator");

exports.list = (req, res) => {
  connection.query(
    "SELECT id, title, description, category, visibility FROM courses",
    function (err, courses) {
      if (err) {
        return res.render("administration", {
          title: "Administration page",
          message: "Error loading courses.",
          user: req.session.user,
          courses: [],
        });
      }
      res.render("administration", {
        title: "Administration page",
        message: "Welcome to the administration page",
        user: req.session.user,
        courses: courses,
      });
    }
  );
};

exports.getCreate = (req, res) => {
  res.render("course-form", {
    title: "Add Course",
    course: {},
    errors: [],
    user: req.session.user,
  });
};

exports.postCreate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("course-form", {
      title: "Add Course",
      course: req.body,
      errors: errors.array(),
      user: req.session.user,
    });
  }
  const { title, description, category, visibility } = req.body;
  connection.query(
    "INSERT INTO courses (title, description, category, visibility) VALUES (?, ?, ?, ?)",
    [title, description, category, visibility],
    function (err) {
      if (err) {
        return res.render("course-form", {
          title: "Add Course",
          course: req.body,
          errors: [{ msg: "Error creating course." }],
          user: req.session.user,
        });
      }
      res.redirect("/administration");
    }
  );
};

exports.getEdit = (req, res) => {
  connection.query(
    "SELECT * FROM courses WHERE id = ?",
    [req.params.id],
    function (err, results) {
      if (err || results.length === 0) {
        return res.redirect("/administration");
      }
      res.render("course-form", {
        title: "Edit Course",
        course: results[0],
        errors: [],
        user: req.session.user,
      });
    }
  );
};

exports.postEdit = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("course-form", {
      title: "Edit Course",
      course: { ...req.body, id: req.params.id },
      errors: errors.array(),
      user: req.session.user,
    });
  }
  const { title, description, category, visibility } = req.body;
  connection.query(
    "UPDATE courses SET title = ?, description = ?, category = ?, visibility = ? WHERE id = ?",
    [title, description, category, visibility, req.params.id],
    function (err) {
      if (err) {
        return res.render("course-form", {
          title: "Edit Course",
          course: { ...req.body, id: req.params.id },
          errors: [{ msg: "Error updating course." }],
          user: req.session.user,
        });
      }
      res.redirect("/administration");
    }
  );
};

exports.delete = (req, res) => {
  connection.query(
    "DELETE FROM courses WHERE id = ?",
    [req.params.id],
    function (err) {
      // Optionally handle error
      res.redirect("/administration");
    }
  );
};

exports.getAll = (req, res) => {
  connection.query(
    "SELECT id, title, description, category, visibility FROM courses",
    function (err, courses) {
      if (err) {
        return res.render("courses", {
          title: "Courses",
          courses: [],
          user: req.session.user,
          message: "Error loading courses.",
        });
      }
      res.render("courses", {
        title: "Courses",
        courses: courses,
        user: req.session.user,
      });
    }
  );
};

exports.getDetails = (req, res) => {
  const isLoggedIn = req.session.user ? true : false;
  const visibilityCondition = isLoggedIn
    ? "WHERE id = ?"
    : "WHERE id = ? AND visibility = 'public'";

  connection.query(
    `SELECT * FROM courses ${visibilityCondition}`,
    [req.params.id],
    function (err, results) {
      if (err || results.length === 0) {
        return res.redirect("/courses");
      }
      res.render("course-details", {
        title: results[0].title,
        course: results[0],
        user: req.session.user,
      });
    }
  );
};
