"use strict"
/** @type {import('sequelize-cli').Migration} */

const { 
  ADMIN_ID,
  KOORDINATOR_ID,
  KEPALA_ID,
  TEKNISI_ID,
} = require("../config/consts")

const M_DASHBOARD_ID = "b78ab51a-2cd4-4fd2-931c-e801d2e6e95f"
const M_KOTAK_MASUK_ID = "231ffb55-bd57-423d-becd-f8719bd954bf"
const M_MASTER_ID = "7ef31d3c-7c32-4901-8691-2030c3b17e36"
const M_PERUSAHAAN_ID = "d6d77a92-a61a-4ae7-ac8f-b8068f69e14e"
const M_KOLAM_ID = "79c07083-d29a-497c-8b32-712813c591fa"
const M_BLOK_ID = "44065bc4-fbed-4732-ae3b-997b4c5143c7"
// const M_JENIS_PLANKTON_ID = "51e18967-0d0e-43f8-b458-261655b1538e"
const M_LABORATORIUM_ID = "aa2672bf-ec23-43e4-ac38-546171766b1b"
const M_GRAFIK_MONITORING_ID = "88eb5898-9790-4a6b-a331-9e2973c9227e"
const M_LAPORAN_ID = "67920e5e-476b-4179-969f-09d4c4f38d38"

const M_AKUN_SAYA_ID = "414768a3-18da-443d-8ca8-15272ad66bb3"
const M_MANAJEMEN_USER_ID = "0a53b860-76a5-41fd-b1b5-5f372ce24b5e"
const M_HAK_AKSES_ID = "ef1e9c80-3eaa-463a-af94-b3eb025fce63"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: ADMIN_ID,
          roleName: "Admin",
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {})
  },
}
