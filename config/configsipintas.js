require('dotenv').config()
module.exports = {
  "development": {
    "username": process.env.DBSIPINTAS_USERNAME,
    "password": process.env.DBSIPINTAS_PASSWORD,
    "database": process.env.DBSIPINTAS_NAME,
    "dialect": process.env.DB_DIALECT,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT
  },
  "staging": {
    "username": process.env.DBSIPINTAS_USERNAME,
    "password": process.env.DBSIPINTAS_PASSWORD,
    "database": process.env.DBSIPINTAS_NAME,
    "dialect": process.env.DB_DIALECT,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT
  },
  "production": {
    "username": process.env.DBSIPINTAS_USERNAME,
    "password": process.env.DBSIPINTAS_PASSWORD,
    "database": process.env.DBSIPINTAS_NAME,
    "dialect": process.env.DB_DIALECT,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT
  }
}
