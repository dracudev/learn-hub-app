const userSchema = {
  tableName: "users",
  fields: {
    id: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: "STRING",
      maxLength: 100,
      required: true,
    },
    email: {
      type: "STRING",
      maxLength: 100,
      required: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: "STRING",
      maxLength: 255,
      required: true,
    },
    role: {
      type: "ENUM",
      values: ["public", "registered", "admin"],
      default: "registered",
    },
    profile_picture: {
      type: "STRING",
      maxLength: 255,
      required: false,
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
      foreignKey: "user_id",
    },
  },
  hooks: {
    beforeCreate: "hashPassword",
    beforeUpdate: "hashPassword",
  },
};

module.exports = userSchema;
