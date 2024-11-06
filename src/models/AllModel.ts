import { Sequelize } from "sequelize"
import { TModels } from "../types/TModels"
import user from "./UserModel"
import role from "./RoleModel"
import file from "./FileModel"

export default class AllModel {
  load(sequelize: Sequelize) {
    const User = user.load(sequelize)
    const Role = role.load(sequelize)
    const File = file.load(sequelize)

    const models: TModels = {
      User,
      Role,
      File,
    }

    user.associates(models)
    role.associates(models)
    file.associates(models)

    return models
  }
}
