const { Course, Enrollment } = require("../models");
const { validationResult } = require("express-validator");

const courseController = {
  list: async (req, res) => {
    try {
      const courses = await Course.findAll({
        attributes: ["id", "title", "description", "category", "visibility"],
      });
      res.render("admin", {
        title: "Admin",
        message: "Welcome to the administration page",
        user: req.session.user,
        courses: courses,
      });
    } catch (err) {
      console.error("Error loading courses:", err);
      res.render("admin", {
        title: "Admin",
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
      await Course.create({
        title,
        description,
        category,
        visibility,
      });
      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error("Error creating course:", err);
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
      const course = await Course.findByPk(req.params.id);
      if (!course) {
        return res.redirect("/admin/dashboard");
      }
      res.render("course-form", {
        title: "Edit Course",
        course: course.toJSON(),
        errors: [],
        user: req.session.user,
      });
    } catch (err) {
      console.error("Error loading course:", err);
      res.redirect("/admin/dashboard");
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
      await Course.update(
        { title, description, category, visibility },
        { where: { id: req.params.id } }
      );
      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error("Error updating course:", err);
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
      await Course.destroy({
        where: { id: req.params.id },
      });
    } catch (err) {
      console.error("Error deleting course:", err);
    }
    res.redirect("/admin/dashboard");
  },

  getAll: async (req, res) => {
    try {
      const courses = await Course.findAll({
        attributes: ["id", "title", "description", "category", "visibility"],
      });

      // If user is logged in, check enrollment status for each course
      let coursesWithEnrollment = courses.map((course) => course.toJSON());
      if (req.session.user) {
        const userId = req.session.user.id;

        for (let course of coursesWithEnrollment) {
          const enrollment = await Enrollment.findOne({
            where: {
              user_id: userId,
              course_id: course.id,
            },
            attributes: ["id", "user_id", "course_id", "created_at"],
          });
          course.isEnrolled = !!enrollment;
        }
      }

      res.render("courses", {
        title: "Courses",
        courses: coursesWithEnrollment,
        user: req.session.user,
      });
    } catch (err) {
      console.error("Error loading courses:", err);
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
      const whereCondition = { id: req.params.id };

      if (!isLoggedIn) {
        whereCondition.visibility = "public";
      }

      const course = await Course.findOne({
        where: whereCondition,
      });

      if (!course) {
        return res.redirect("/courses");
      }

      res.render("course-details", {
        title: course.title,
        course: course.toJSON(),
        user: req.session.user,
      });
    } catch (err) {
      console.error("Error loading course details:", err);
      res.redirect("/courses");
    }
  },
};

module.exports = courseController;
