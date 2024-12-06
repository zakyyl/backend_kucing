'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pengguna extends Model {
    static associate(models) {
      // define association here
    }
  }
  Pengguna.init({
    nama: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    no_telepon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user', // default role adalah 'user'
    }
  }, {
    sequelize,
    modelName: 'Pengguna',
    tableName: 'Penggunas',
  });
  return Pengguna;
};
