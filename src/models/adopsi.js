'use strict';

module.exports = (sequelize, DataTypes) => {
  const Adopsi = sequelize.define('Adopsi', {
    id_adopsi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pengajuan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_kucing: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_kucing: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_pengguna: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_pengguna: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_adopsi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false, // Status wajib diisi
      defaultValue: "diproses",
    }
  }, {
    tableName: 'adopsi',
    timestamps: true
  });

  // Hook untuk mengisi nama_kucing dan nama_pengguna secara otomatis
  Adopsi.beforeCreate(async (adopsi, options) => {
    const kucing = await sequelize.models.Kucing.findByPk(adopsi.id_kucing, {
      attributes: ['nama']
    });
    if (!kucing) throw new Error('Kucing tidak ditemukan!');
    adopsi.nama_kucing = kucing.nama;

    const pengguna = await sequelize.models.Pengguna.findByPk(adopsi.id_pengguna, {
      attributes: ['nama']
    });
    if (!pengguna) throw new Error('Pengguna tidak ditemukan!');
    adopsi.nama_pengguna = pengguna.nama;
  });

  Adopsi.associate = (models) => {
    Adopsi.belongsTo(models.Pengajuan, { foreignKey: 'id_pengajuan' , as: "pengajuan"});
    Adopsi.belongsTo(models.Kucing, { foreignKey: 'id_kucing' });
    Adopsi.belongsTo(models.Pengguna, { foreignKey: 'id_pengguna' });
  };

  return Adopsi;
};
