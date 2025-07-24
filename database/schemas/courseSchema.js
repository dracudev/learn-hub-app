const courseSchema = {
  tableName: "courses",
  fields: {
    id: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: "STRING",
      maxLength: 150,
      required: true,
    },
    description: {
      type: "TEXT",
      required: false,
    },
    category: {
      type: "STRING",
      maxLength: 100,
      required: false,
    },
    visibility: {
      type: "ENUM",
      values: ["public", "private"],
      default: "public",
    },
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: false,
  },
  relationships: {
    enrollments: {
      type: "hasMany",
      model: "Enrollment",
      foreignKey: "course_id",
    },
  },
};

module.exports = courseSchema;
