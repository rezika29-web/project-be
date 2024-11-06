"use strict"
/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require("uuid")
const sha1 = require("sha1")

const { 
  ADMIN_ID,
  KOORDINATOR_ID,
  KEPALA_ID,
  TEKNISI_ID,
} = require("../config/consts")

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = sha1("salt-" + uuidv4())
    const password = sha1("@Admin2024")

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "0cda3cdf-dcf9-4c30-8f35-606a2188ee8a",
          firstName: "Septiandri",
          lastName: "Rezika",
          photo: null,
          username: "admin",
          nip: "11111",
          phoneNumber: "0123",
          password,
          roleId: ADMIN_ID,
          createdAt: new Date(),
        },
        {
          id: "e29fb789-f7b0-4881-8d64-48d9da37772b",
          firstName: "Boby",
          lastName: "Suhendra",
          photo: null,
          username: "boby",
          nip: "19851008201001015",
          phoneNumber: "0123",
          password,
          roleId: ADMIN_ID,
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {})
  },
}
