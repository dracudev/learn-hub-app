const { User, Course, Enrollment } = require("../models");
const { validationResult } = require("express-validator");
const { uploadToVercelBlob } = require("../middleware/upload");

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

      const formattedCourses = enrolledCourses.map((course) => {
        const courseData = course.toJSON();
        courseData.enrollment_date = courseData.enrollments[0].created_at;
        delete courseData.enrollments;
        return courseData;
      });

      res.render("profile", {
        title: "My Profile",
        user: req.session.user,
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

      const course = await Course.findByPk(courseId);

      if (!course) {
        return res.status(404).render("error", {
          title: "Course Not Found",
          error: {
            status: 404,
            message: "The course you're trying to enroll in doesn't exist",
          },
          user: req.session.user,
        });
      }

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

      try {
        await Enrollment.create({
          user_id: userId,
          course_id: courseId,
        });
      } catch (err) {
        // If unique constraint error, just redirect (already enrolled)
        if (
          err.name === "SequelizeUniqueConstraintError" ||
          (err.parent && err.parent.code === "23505")
        ) {
          return res.redirect("/courses");
        }
        throw err;
      }

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

      await Enrollment.destroy({
        where: {
          user_id: userId,
          course_id: courseId,
        },
      });

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

      // Upload to Vercel Blob
      let blobUrl;
      try {
        blobUrl = await uploadToVercelBlob(req.file);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Failed to upload image to blob" });
      }

      if (
        user.profile_picture &&
        !user.profile_picture.includes("default-avatar.png") &&
        user.profile_picture.startsWith("https://blob.vercel-storage.com/")
      ) {
        try {
          await fetch(user.profile_picture, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            },
          });
        } catch (err) {
          console.warn("Failed to delete old profile image from blob:", err);
        }
      }

      await user.update({ profile_picture: blobUrl });
      req.session.user.profile_picture = blobUrl;

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: blobUrl,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Failed to update profile picture" });
    }
  },
};

module.exports = userController;
