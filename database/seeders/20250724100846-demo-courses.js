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
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("courses", null, {});
  },
};
