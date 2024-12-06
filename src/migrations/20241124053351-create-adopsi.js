'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => { // <-- Pastikan ini async
    await queryInterface.createTable('adopsi', {
      id_adopsi: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_pengajuan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pengajuan',
          key: 'id_pengajuan'
        }
      },
      id_kucing: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kucings',
          key: 'id'
        }
      },
      nama_kucing: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_pengguna: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Penggunas',
          key: 'id'
        }
      },
      nama_pengguna: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggal_adopsi: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'diproses'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => { // <-- Pastikan ini async
    await queryInterface.dropTable('adopsi');
  }
};
