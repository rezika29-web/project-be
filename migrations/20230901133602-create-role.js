'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50),
      },
      roleName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      menu: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      cornerMenu: {
        type: Sequelize.JSON,
        allowNull: true,
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
    await queryInterface.dropTable('roles')
  }
  
}