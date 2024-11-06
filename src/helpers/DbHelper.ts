import { Sequelize } from "sequelize"
import config from "../config/AllConfig"
import AllModel from "../models/AllModel"

export class DbHelper {

  connectAndGetModels() {
    const {
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD,
      DB_DIALECT,
      DB_HOST,
      DB_PORT,
      DB_POOL_MAX,
      DB_POOL_MIN,
      DB_POOL_ACQUIRE,
      DB_POOL_IDLE,
    } = config.envy

    console.log('data db', {
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD,
      DB_DIALECT,
      DB_HOST,
      DB_PORT,
      DB_POOL_MAX,
      DB_POOL_MIN,
      DB_POOL_ACQUIRE,
      DB_POOL_IDLE,
    })

    const sequelize = new Sequelize(
      DB_NAME, 
      DB_USERNAME, 
      DB_PASSWORD, {
        dialect: DB_DIALECT,
        host: DB_HOST,
        port: DB_PORT,
        pool: {
          max: DB_POOL_MAX,
          min: DB_POOL_MIN,
          acquire: DB_POOL_ACQUIRE,
          idle: DB_POOL_IDLE,
        }
      })

    const allModel = new AllModel()
    const models = allModel.load(sequelize)
    
    return {
      sequelize,
      ...models,
    }
  }

}

export const dbHelper = new DbHelper()