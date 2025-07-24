const userSchema = require("./userSchema");
const courseSchema = require("./courseSchema");
const enrollmentSchema = require("./enrollmentSchema");

module.exports = {
  User: userSchema,
  Course: courseSchema,
  Enrollment: enrollmentSchema,

  // Helper function to get all schemas
  getAll() {
    return {
      User: userSchema,
      Course: courseSchema,
      Enrollment: enrollmentSchema,
    };
  },

  // Helper function to get schema by name
  getSchema(name) {
    return this[name];
  },
};
