"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "courses",
      [
        {
          title: "JavaScript Course",
          description: "Learn JS from scratch",
          category: "Programming",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "Advanced Node.js Course",
          description: "Advanced server-side Node.js",
          category: "Back-end",
          visibility: "private",
          created_at: new Date(),
        },
        {
          title: "React Fundamentals",
          description: "Learn React from the ground up",
          category: "Front-end",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "Database Design",
          description: "Learn how to design efficient databases",
          category: "Database",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "Python for Data Science",
          description: "Master Python for data analysis and machine learning",
          category: "Data Science",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "Mobile App Development with Flutter",
          description: "Build cross-platform mobile apps with Flutter",
          category: "Mobile Development",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "DevOps Fundamentals",
          description: "Learn CI/CD, containerization, and cloud deployment",
          category: "DevOps",
          visibility: "private",
          created_at: new Date(),
        },
        {
          title: "UI/UX Design Principles",
          description: "Create intuitive and beautiful user interfaces",
          category: "Design",
          visibility: "public",
          created_at: new Date(),
        },
        {
          title: "Cybersecurity Essentials",
          description: "Understand security threats and protection strategies",
          category: "Security",
          visibility: "private",
          created_at: new Date(),
        },
        {
          title: "Machine Learning with TensorFlow",
          description: "Build and deploy ML models using TensorFlow",
          category: "AI/ML",
          visibility: "public",
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};
