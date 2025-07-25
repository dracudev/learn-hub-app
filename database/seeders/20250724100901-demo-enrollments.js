"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name FROM users ORDER BY id;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const courses = await queryInterface.sequelize.query(
      "SELECT id, title FROM courses ORDER BY id;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length >= 2 && courses.length >= 2) {
      await queryInterface.bulkInsert(
        "enrollments",
        [
          {
            user_id: users[1].id,
            course_id: courses[0].id,
            created_at: new Date(),
          },
          {
            user_id: users[1].id,
            course_id: courses[2] ? courses[2].id : courses[0].id,
            created_at: new Date(),
          },
          {
            user_id: users[2] ? users[2].id : users[1].id,
            course_id: courses[0].id,
            created_at: new Date(),
          },
          {
            user_id: users[2] ? users[2].id : users[1].id,
            course_id: courses[3] ? courses[3].id : courses[1].id,
            created_at: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("enrollments", null, {});
  },
};
