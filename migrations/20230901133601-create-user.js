'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50),
      },
      fullName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      photo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      nip: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      roleId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
  
}