import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"
import { TModels } from "../types/TModels"

export class FileModel extends Model<
  InferAttributes<FileModel>,
  InferCreationAttributes<FileModel>
> {
  declare id: string
  declare refTable: string
  declare refField: string
  declare title: string
  declare fileName: string
  declare path: string
  declare mimeType: string
  declare size: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

function load(sequelize: Sequelize) {
  return FileModel.init(
    {
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      refTable: {
        type: new DataTypes.STRING(50),
        allowNull: true,
      },
      refField: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "files",
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    }
  )
}

function associates(models: TModels) {
  // Associations here
}

export default {
  load,
  associates,
}