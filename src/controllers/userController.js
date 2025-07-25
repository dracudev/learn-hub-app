const { User, Course, Enrollment } = require("../models");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const userController = {
  showProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      const userId = req.session.user.id;

      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "name",
          "email",
          "role",
          "profile_picture",
          "created_at",
        ],
      });

      if (!user) {
        return res.redirect("/auth/login");
      }

      const enrolledCourses = await Course.findAll({
        include: [
          {
            model: Enrollment,
            as: "enrollments",
            where: { user_id: userId },
            attributes: ["id", "user_id", "course_id", "created_at"],
          },
        ],
        order: [["enrollments", "created_at", "DESC"]],
      });

      // Format the data for the view
      const formattedCourses = enrolledCourses.map((course) => {
        const courseData = course.toJSON();
        courseData.enrollment_date = courseData.enrollments[0].created_at;
        delete courseData.enrollments;
        return courseData;
      });

      res.render("profile", {
        title: "LearnHub | My Profile",
        user: user.toJSON(),
        enrolledCourses: formattedCourses,
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
      const course = await Course.findByPk(courseId);

      if (!course) {
        return res.status(404).render("error", {
          title: "LearnHub | Course Not Found",
          error: {
            status: 404,
            message: "The course you're trying to enroll in doesn't exist",
          },
          user: req.session.user,
        });
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        where: {
          user_id: userId,
          course_id: courseId,
        },
        attributes: ["id", "user_id", "course_id", "created_at"],
      });

      if (existingEnrollment) {
        return res.redirect("/courses");
      }

      // Enroll user
      await Enrollment.create({
        user_id: userId,
        course_id: courseId,
      });

      res.redirect("/courses");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      res.status(500).render("error", {
        title: "LearnHub | Enrollment Error",
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

      await Enrollment.destroy({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      });

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
        title: "LearnHub | Unenrollment Error",
        error: {
          status: 500,
          message: "Failed to unenroll from course",
        },
        user: req.session.user,
      });
    }
  },

  updateProfilePicture: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.session.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete old profile picture if it exists and is not the default
      if (
        user.profile_picture &&
        !user.profile_picture.includes("default-avatar.png")
      ) {
        const oldImagePath = path.join(
          __dirname,
          "../../public",
          user.profile_picture
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update user with new profile picture path
      const newProfilePicturePath = `/uploads/${req.file.filename}`;
      await user.update({ profile_picture: newProfilePicturePath });

      // Update session data
      req.session.user.profile_picture = newProfilePicturePath;

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: newProfilePicturePath,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);

      // Clean up uploaded file if there was an error
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../public/uploads",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({ error: "Failed to update profile picture" });
    }
  },
};

module.exports = userController;
