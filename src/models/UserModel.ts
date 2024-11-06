import { 
  Sequelize, 
  Model, 
  DataTypes, 
  ForeignKey,
  NonAttribute,
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional,
} from 'sequelize'

import { TModels } from '../types/TModels'
import { RoleModel } from './RoleModel'

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: string
  declare firstName: string
  declare lastName: string
  declare photo: string
  declare username: string
  declare nip: string
  declare phoneNumber: string
  declare password: string
  declare roleId: ForeignKey<RoleModel['id']>
  declare role?: NonAttribute<RoleModel>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

function load(sequelize: Sequelize) {
  return UserModel.init(
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      firstName: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: new DataTypes.STRING(100),
        allowNull: true,
      },
      photo: {
        type: new DataTypes.STRING(100),
        allowNull: true,
      },
      username: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      nip: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      phoneNumber: {
        type: new DataTypes.STRING(20),
        allowNull: false,
      },
      roleId: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      createdAt: true,
      updatedAt: true, 
    }
  )
}

function associates(models: TModels) {
  models.User.belongsTo(models.Role, {
    foreignKey: "roleId",
    as: "role",
  })
}

export default {
  load,
  associates,
}