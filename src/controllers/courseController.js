const connection = require("../config/database");
const { validationResult } = require("express-validator");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

const courseController = {
  list: async (req, res) => {
    try {
      const courses = await query(
        "SELECT id, title, description, category, visibility FROM courses"
      );
      res.render("administration", {
        title: "Administration page",
        message: "Welcome to the administration page",
        user: req.session.user,
        courses: courses,
      });
    } catch (err) {
      res.render("administration", {
        title: "Administration page",
        message: "Error loading courses.",
        user: req.session.user,
        courses: [],
      });
    }
  },

  getCreate: (req, res) => {
    res.render("course-form", {
      title: "Add Course",
      course: {},
      errors: [],
      user: req.session.user,
    });
  },

  postCreate: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("course-form", {
        title: "Add Course",
        course: req.body,
        errors: errors.array(),
        user: req.session.user,
      });
    }

    try {
      const { title, description, category, visibility } = req.body;
      await query(
        "INSERT INTO courses (title, description, category, visibility) VALUES (?, ?, ?, ?)",
        [title, description, category, visibility]
      );
      res.redirect("/administration");
    } catch (err) {
      res.render("course-form", {
        title: "Add Course",
        course: req.body,
        errors: [{ msg: "Error creating course." }],
        user: req.session.user,
      });
    }
  },

  getEdit: async (req, res) => {
    try {
      const results = await query("SELECT * FROM courses WHERE id = ?", [
        req.params.id,
      ]);
      if (results.length === 0) {
        return res.redirect("/administration");
      }
      res.render("course-form", {
        title: "Edit Course",
        course: results[0],
        errors: [],
        user: req.session.user,
      });
    } catch (err) {
      res.redirect("/administration");
    }
  },

  postEdit: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("course-form", {
        title: "Edit Course",
        course: { ...req.body, id: req.params.id },
        errors: errors.array(),
        user: req.session.user,
      });
    }

    try {
      const { title, description, category, visibility } = req.body;
      await query(
        "UPDATE courses SET title = ?, description = ?, category = ?, visibility = ? WHERE id = ?",
        [title, description, category, visibility, req.params.id]
      );
      res.redirect("/administration");
    } catch (err) {
      res.render("course-form", {
        title: "Edit Course",
        course: { ...req.body, id: req.params.id },
        errors: [{ msg: "Error updating course." }],
        user: req.session.user,
      });
    }
  },

  delete: async (req, res) => {
    try {
      await query("DELETE FROM courses WHERE id = ?", [req.params.id]);
    } catch (err) {
      console.error("Error deleting course:", err);
    }
    res.redirect("/administration");
  },

  getAll: async (req, res) => {
    try {
      const courses = await query(
        "SELECT id, title, description, category, visibility FROM courses"
      );

      // If user is logged in, check enrollment status for each course
      let coursesWithEnrollment = courses;
      if (req.session.user) {
        const userId = req.session.user.id;

        for (let course of coursesWithEnrollment) {
          const enrollmentCheck = await query(
            "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
            [userId, course.id]
          );
          course.isEnrolled = enrollmentCheck.length > 0;
        }
      }

      res.render("courses", {
        title: "Courses",
        courses: coursesWithEnrollment,
        user: req.session.user,
      });
    } catch (err) {
      res.render("courses", {
        title: "Courses",
        courses: [],
        user: req.session.user,
        message: "Error loading courses.",
      });
    }
  },

  getDetails: async (req, res) => {
    try {
      const isLoggedIn = req.session.user ? true : false;
      const visibilityCondition = isLoggedIn
        ? "WHERE id = ?"
        : "WHERE id = ? AND visibility = 'public'";

      const results = await query(
        `SELECT * FROM courses ${visibilityCondition}`,
        [req.params.id]
      );

      if (results.length === 0) {
        return res.redirect("/courses");
      }

      res.render("course-details", {
        title: results[0].title,
        course: results[0],
        user: req.session.user,
      });
    } catch (err) {
      res.redirect("/courses");
    }
  },
};

module.exports = courseController;
