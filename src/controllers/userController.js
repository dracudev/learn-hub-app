const connection = require("../config/database");
const { validationResult } = require("express-validator");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

const userController = {
  showProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const userId = req.session.user.id;

      const userResults = await query(
        "SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = ?",
        [userId]
      );

      if (userResults.length === 0) {
        return res.redirect("/auth/login");
      }

      const user = userResults[0];

      const enrolledResults = await query(
        `
        SELECT c.id, c.title, c.description, c.category, c.visibility, e.enrollment_date
        FROM courses c
        INNER JOIN enrollments e ON c.id = e.course_id
        WHERE e.user_id = ?
        ORDER BY e.enrollment_date DESC
      `,
        [userId]
      );

      res.render("profile", {
        title: "My Profile",
        user: user,
        enrolledCourses: enrolledResults,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      res.status(500).render("error", {
        title: "Error",
        error: {
          status: 500,
          message: "Unable to load profile information",
        },
        user: req.session.user,
      });
    }
  },

  enrollCourse: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const userId = req.session.user.id;
      const courseId = req.params.courseId;

      // Check if course exists
      const courseResults = await query("SELECT id FROM courses WHERE id = ?", [
        courseId,
      ]);

      if (courseResults.length === 0) {
        return res.status(404).render("error", {
          title: "Course Not Found",
          error: {
            status: 404,
            message: "The course you're trying to enroll in doesn't exist",
          },
          user: req.session.user,
        });
      }

      // Check if already enrolled
      const enrollmentResults = await query(
        "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
        [userId, courseId]
      );

      if (enrollmentResults.length > 0) {
        return res.redirect("/courses");
      }

      // Enroll user
      await query(
        "INSERT INTO enrollments (user_id, course_id, enrollment_date) VALUES (?, ?, NOW())",
        [userId, courseId]
      );

      res.redirect("/courses");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      res.status(500).render("error", {
        title: "Enrollment Error",
        error: {
          status: 500,
          message: "Failed to enroll in course",
        },
        user: req.session.user,
      });
    }
  },

  unenrollCourse: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const userId = req.session.user.id;
      const courseId = req.params.courseId;

      await query(
        "DELETE FROM enrollments WHERE user_id = ? AND course_id = ?",
        [userId, courseId]
      );

      // Check if request came from profile page
      const referer = req.get("Referer");
      if (referer && referer.includes("/profile")) {
        res.redirect("/user/profile");
      } else {
        res.redirect("/courses");
      }
    } catch (err) {
      console.error("Error unenrolling from course:", err);
      res.status(500).render("error", {
        title: "Unenrollment Error",
        error: {
          status: 500,
          message: "Failed to unenroll from course",
        },
        user: req.session.user,
      });
    }
  },
};

module.exports = userController;
