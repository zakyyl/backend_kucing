'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    
    return queryInterface.bulkInsert('Admins', [
      {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin Utama',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Admins', null, {});
  }
};