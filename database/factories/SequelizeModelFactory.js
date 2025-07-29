const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class SequelizeModelFactory {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.models = {};
  }

  createModel(name, schema) {
    const attributes = this.convertFieldsToSequelize(schema.fields);
    const options = this.convertOptionsToSequelize(schema);

    const model = this.sequelize.define(name, attributes, options);

    if (schema.hooks) {
      this.addHooks(model, schema.hooks);
    }

    this.models[name] = model;
    return model;
  }

  convertFieldsToSequelize(fields) {
    const sequelizeFields = {};

    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      sequelizeFields[fieldName] = this.convertFieldType(fieldConfig);
    }

    return sequelizeFields;
  }

  convertFieldType(fieldConfig) {
    const sequelizeField = {};

    switch (fieldConfig.type) {
      case "INTEGER":
        sequelizeField.type = DataTypes.INTEGER;
        break;
      case "STRING":
        sequelizeField.type = DataTypes.STRING(fieldConfig.maxLength);
        break;
      case "TEXT":
        sequelizeField.type = DataTypes.TEXT;
        break;
      case "DATE":
        sequelizeField.type = DataTypes.DATE;
        break;
      case "ENUM":
        sequelizeField.type = DataTypes.ENUM(...fieldConfig.values);
        break;
      default:
        sequelizeField.type = DataTypes.STRING;
    }

    if (fieldConfig.primaryKey) sequelizeField.primaryKey = true;
    if (fieldConfig.autoIncrement) sequelizeField.autoIncrement = true;
    if (fieldConfig.required) sequelizeField.allowNull = false;
    if (fieldConfig.unique) sequelizeField.unique = true;
    if (fieldConfig.defaultValue) {
      if (fieldConfig.defaultValue === "NOW") {
        sequelizeField.defaultValue = DataTypes.NOW;
      } else {
        sequelizeField.defaultValue = fieldConfig.defaultValue;
      }
    }

    if (fieldConfig.validate) {
      sequelizeField.validate = fieldConfig.validate;
    }

    if (fieldConfig.references) {
      sequelizeField.references = {
        model: fieldConfig.references.model,
        key: fieldConfig.references.key,
      };
      sequelizeField.onDelete = "CASCADE";
      sequelizeField.onUpdate = "CASCADE";
    }

    return sequelizeField;
  }

  convertOptionsToSequelize(schema) {
    const options = {
      tableName: schema.tableName,
    };

    if (schema.timestamps === false) {
      options.timestamps = false;
    } else if (schema.timestamps) {
      options.timestamps = true;
      if (schema.timestamps.createdAt) {
        options.createdAt = schema.timestamps.createdAt;
      }
      if (schema.timestamps.updatedAt === false) {
        options.updatedAt = false;
      }
    }

    if (schema.indexes) {
      options.indexes = schema.indexes;
    }

    return options;
  }

  addHooks(model, hooks) {
    if (hooks.beforeCreate === "hashPassword") {
      model.addHook("beforeCreate", async (instance) => {
        if (instance.password) {
          instance.password = await bcrypt.hash(instance.password, 10);
        }
      });
    }

    if (hooks.beforeUpdate === "hashPassword") {
      model.addHook("beforeUpdate", async (instance) => {
        if (instance.changed("password")) {
          instance.password = await bcrypt.hash(instance.password, 10);
        }
      });
    }
  }

  setupAssociations(schemas) {
    for (const [modelName, schema] of Object.entries(schemas)) {
      if (schema.relationships) {
        const model = this.models[modelName];

        for (const [relationName, relationConfig] of Object.entries(
          schema.relationships
        )) {
          const targetModel = this.models[relationConfig.model];

          switch (relationConfig.type) {
            case "hasMany":
              model.hasMany(targetModel, {
                foreignKey: relationConfig.foreignKey,
                as: relationName,
              });
              break;
            case "belongsTo":
              model.belongsTo(targetModel, {
                foreignKey: relationConfig.foreignKey,
                as: relationName.toLowerCase(),
              });
              break;
          }
        }
      }
    }
  }

  getModels() {
    return this.models;
  }
}

module.exports = SequelizeModelFactory;
