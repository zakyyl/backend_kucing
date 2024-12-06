'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Penggunas', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '123', 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Penggunas', 'password');
  },
};

