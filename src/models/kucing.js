'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kucing extends Model {
    static associate(models) {
      // Tambahkan asosiasi untuk Kucing
      Kucing.hasMany(models.Pengajuan, { 
        foreignKey: 'id_kucing',
        as: 'pengajuans'
      });
      
      Kucing.hasMany(models.Adopsi, { 
        foreignKey: 'id_kucing',
        as: 'adopsis'
      });
    }
  }

  Kucing.init({
    nama: DataTypes.STRING,
    ras: DataTypes.STRING,
    jk: DataTypes.STRING,
    umur: DataTypes.INTEGER,
    kondisi: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    foto: DataTypes.STRING  // Menyimpan nama file foto
  }, {
    sequelize,
    modelName: 'Kucing',
    tableName: "Kucings"
  });

  return Kucing;
};