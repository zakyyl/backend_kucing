'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Admin', // default role adalah 'admin'
    }
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
  });
  return Admin;
};
