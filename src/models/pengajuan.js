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
  

  // Menambahkan hook afterCreate
  // Pengajuan.afterCreate(async (pengajuan, options) => {
  //   try {
  //     console.log('Hook afterCreate triggered'); // Debugging log
  //     const { id_kucing, id_pengguna } = pengajuan;
  
  //     // Ambil data kucing dan pengguna terkait
  //     const kucing = await sequelize.models.Kucing.findByPk(id_kucing);
  //     const pengguna = await sequelize.models.Pengguna.findByPk(id_pengguna);
  
  //     if (kucing && pengguna) {
  //       // Buat entri di tabel adopsi
  //       await sequelize.models.Adopsi.create({
  //         id_pengajuan: pengajuan.id_pengajuan,
  //         id_kucing: kucing.id,
  //         nama_kucing: kucing.nama, // Nama kucing dari tabel Kucing
  //         id_pengguna: pengguna.id,
  //         nama_pengguna: pengguna.nama // Nama pengguna dari tabel Pengguna
  //       });
  //       console.log('Adopsi created successfully'); // Debugging log
  //     }
  //   } catch (error) {
  //     console.error("Error creating adopsi: ", error.message);
  //   }
  // });
  

  return Pengajuan;
};
