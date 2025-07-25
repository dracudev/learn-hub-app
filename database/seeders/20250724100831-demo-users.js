"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedAdminPassword = await bcrypt.hash("admin", 10);
    const hashedUserPassword = await bcrypt.hash("user", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin",
          email: "admin@admin.com",
          password: hashedAdminPassword,
          role: "admin",
          created_at: new Date(),
        },
        {
          name: "John Smith",
          email: "user@user.com",
          password: hashedUserPassword,
          role: "registered",
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
