import { Sequelize } from "sequelize"

interface TDB extends TModels {
  sequelize: Sequelize
}
