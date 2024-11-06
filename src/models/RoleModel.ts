import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"
import { TModels } from "../types/TModels"

export class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: string
  declare roleName: string
  declare menu: JSON
  declare cornerMenu: JSON
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

function load(sequelize: Sequelize) {
  return RoleModel.init(
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      roleName: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      menu: {
        type: new DataTypes.JSON(),
        allowNull: true,
      },
      cornerMenu: {
        type: new DataTypes.JSON(),
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "roles",
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    }
  )
}

function associates(models: TModels) {
  // models.Role.hasMany(models.User, {
  //   sourceKey: 'id',
  //   foreignKey: 'roleId',
  //   as: 'users',
  // })
}

export default {
  load,
  associates,
}
