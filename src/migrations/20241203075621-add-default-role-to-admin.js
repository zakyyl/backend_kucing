'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Menambahkan default value untuk kolom 'role' pada tabel 'Admins'
    await queryInterface.changeColumn('Admins', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'admin', // Menambahkan default value 'admin'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus default value jika rollback
    await queryInterface.changeColumn('Admins', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: null, // Mengembalikan default value menjadi null
    });
  }
};
