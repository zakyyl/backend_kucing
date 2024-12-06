'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menghapus kolom `tanggal_registrasi` dari tabel `Penggunas`
    await queryInterface.removeColumn('Penggunas', 'tanggal_registrasi');
  },

  async down(queryInterface, Sequelize) {
    // Menambahkan kembali kolom `tanggal_registrasi` jika migrasi di-rollback
    await queryInterface.addColumn('Penggunas', 'tanggal_registrasi', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
  },
};
