'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Penggunas', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Penggunas', 'role');
  },
};
