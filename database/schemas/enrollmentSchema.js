const enrollmentSchema = {
  tableName: "enrollments",
  fields: {
    id: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: "INTEGER",
      required: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    course_id: {
      type: "INTEGER",
      required: true,
      references: {
        model: "courses",
        key: "id",
      },
    },
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: false,
  },
  indexes: [
    {
      unique: true,
      fields: ["user_id", "course_id"],
    },
  ],
  relationships: {
    user: {
      type: "belongsTo",
      model: "User",
      foreignKey: "user_id",
    },
    course: {
      type: "belongsTo",
      model: "Course",
      foreignKey: "course_id",
    },
  },
};

module.exports = enrollmentSchema;
