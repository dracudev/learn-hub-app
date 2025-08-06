"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedAdminPassword = await bcrypt.hash("admin", 10);
    const hashedUserPassword = await bcrypt.hash("user", 10);

    const existingUsers = await queryInterface.sequelize.query(
      "SELECT email FROM users WHERE email IN (:emails)",
      {
        replacements: { emails: ["admin@admin.com", "user@user.com"] },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const existingEmails = existingUsers.map((u) => u.email);

    const usersToInsert = [];
    if (!existingEmails.includes("admin@admin.com")) {
      usersToInsert.push({
        name: "Admin",
        email: "admin@admin.com",
        password: hashedAdminPassword,
        role: "admin",
        created_at: new Date(),
      });
    }
    if (!existingEmails.includes("user@user.com")) {
      usersToInsert.push({
        name: "John Smith",
        email: "user@user.com",
        password: hashedUserPassword,
        role: "registered",
        created_at: new Date(),
      });
    }
    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert("users", usersToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
