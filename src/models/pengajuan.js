module.exports = (sequelize, DataTypes) => {
  const Pengajuan = sequelize.define('Pengajuan', {
    id_pengajuan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_kucing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Kucing',
        key: 'id'
      }
    },
    id_pengguna: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pengguna',
        key: 'id'
      }
    },
    tanggal_pengajuan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status_pengajuan: {
      type: DataTypes.STRING,
      defaultValue: 'menunggu'
    },
    motivasi: DataTypes.TEXT,
    kondisi_rumah: DataTypes.TEXT,
    pengalaman_peliharaan: DataTypes.TEXT
  }, {
    tableName: 'pengajuan',
    timestamps: true
  });

  Pengajuan.associate = (models) => {
    Pengajuan.belongsTo(models.Kucing, { foreignKey: 'id_kucing' });
    Pengajuan.belongsTo(models.Pengguna, { foreignKey: 'id_pengguna' });
    Pengajuan.hasOne(models.Adopsi, { foreignKey: 'id_pengajuan', as: 'adopsi' });
  };
  
  return Pengajuan;
};
