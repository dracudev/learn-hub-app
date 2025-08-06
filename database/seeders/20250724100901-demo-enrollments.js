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
      const enrollmentsToInsert = [
        { user_id: users[1].id, course_id: courses[0].id },
        {
          user_id: users[1].id,
          course_id: courses[2] ? courses[2].id : courses[0].id,
        },
        {
          user_id: users[2] ? users[2].id : users[1].id,
          course_id: courses[0].id,
        },
        {
          user_id: users[2] ? users[2].id : users[1].id,
          course_id: courses[3] ? courses[3].id : courses[1].id,
        },
      ];
      const existing = await queryInterface.sequelize.query(
        `SELECT user_id, course_id FROM enrollments WHERE (user_id, course_id) IN (${enrollmentsToInsert
          .map(() => "(?, ?)")
          .join(",")})`,
        {
          replacements: enrollmentsToInsert.flatMap((e) => [
            e.user_id,
            e.course_id,
          ]),
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const existingPairs = new Set(
        existing.map((e) => `${e.user_id}_${e.course_id}`)
      );
      const toInsert = enrollmentsToInsert
        .filter((e) => !existingPairs.has(`${e.user_id}_${e.course_id}`))
        .map((e) => ({ ...e, created_at: new Date() }));
      if (toInsert.length > 0) {
        await queryInterface.bulkInsert("enrollments", toInsert, {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("enrollments", null, {});
  },
};
