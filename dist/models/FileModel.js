"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = void 0;
const sequelize_1 = require("sequelize");
class FileModel extends sequelize_1.Model {
}
exports.FileModel = FileModel;
function load(sequelize) {
    return FileModel.init({
        id: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
        },
        refTable: {
            type: new sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        refField: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        path: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        mimeType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        size: {
            type: sequelize_1.DataTypes.INTEGER(),
            allowNull: false,
        },
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: "files",
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    });
}
function associates(models) {
    // Associations here
}
exports.default = {
    load,
    associates,
};
