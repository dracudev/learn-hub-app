"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const courseData = [
      {
        title: "JavaScript Course",
        description: "Learn JS from scratch",
        category: "Programming",
        visibility: "public",
      },
      {
        title: "Advanced Node.js Course",
        description: "Advanced server-side Node.js",
        category: "Back-end",
        visibility: "private",
      },
      {
        title: "React Fundamentals",
        description: "Learn React from the ground up",
        category: "Front-end",
        visibility: "public",
      },
      {
        title: "Database Design",
        description: "Learn how to design efficient databases",
        category: "Database",
        visibility: "public",
      },
      {
        title: "Python for Data Science",
        description: "Master Python for data analysis and machine learning",
        category: "Data Science",
        visibility: "public",
      },
      {
        title: "Mobile App Development with Flutter",
        description: "Build cross-platform mobile apps with Flutter",
        category: "Mobile Development",
        visibility: "public",
      },
      {
        title: "DevOps Fundamentals",
        description: "Learn CI/CD, containerization, and cloud deployment",
        category: "DevOps",
        visibility: "private",
      },
      {
        title: "UI/UX Design Principles",
        description: "Create intuitive and beautiful user interfaces",
        category: "Design",
        visibility: "public",
      },
      {
        title: "Cybersecurity Essentials",
        description: "Understand security threats and protection strategies",
        category: "Security",
        visibility: "private",
      },
      {
        title: "Machine Learning with TensorFlow",
        description: "Build and deploy ML models using TensorFlow",
        category: "AI/ML",
        visibility: "public",
      },
    ];
    const existingCourses = await queryInterface.sequelize.query(
      "SELECT title FROM courses WHERE title IN (:titles)",
      {
        replacements: { titles: courseData.map((c) => c.title) },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const existingTitles = existingCourses.map((c) => c.title);
    const toInsert = courseData
      .filter((c) => !existingTitles.includes(c.title))
      .map((c) => ({ ...c, created_at: new Date() }));
    if (toInsert.length > 0) {
      await queryInterface.bulkInsert("courses", toInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};
