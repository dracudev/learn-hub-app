const userSchema = require("./userSchema");
const courseSchema = require("./courseSchema");
const enrollmentSchema = require("./enrollmentSchema");

module.exports = {
  User: userSchema,
  Course: courseSchema,
  Enrollment: enrollmentSchema,

  getAll() {
    return {
      User: userSchema,
      Course: courseSchema,
      Enrollment: enrollmentSchema,
    };
  },

  getSchema(name) {
    return this[name];
  },
};
