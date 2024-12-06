module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengajuan', {
      id_pengajuan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_kucing: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Kucings',
          key: 'id',
        },
        allowNull: false
      },
      id_pengguna: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Penggunas',
          key: 'id',
        },
        allowNull: false
      },
      tanggal_pengajuan: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status_pengajuan: {
        type: Sequelize.STRING,
        defaultValue: 'menunggu'
      },
      motivasi: {
        type: Sequelize.TEXT
      },
      kondisi_rumah: {
        type: Sequelize.TEXT
      },
      pengalaman_peliharaan: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pengajuan');
  }
};
