'use strict'
/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50),
      },
      refTable: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      refField: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      fileName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      mimeType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER(),
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
    await queryInterface.dropTable('files')
  }
  
}