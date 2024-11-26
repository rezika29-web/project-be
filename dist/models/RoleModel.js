"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const sequelize_1 = require("sequelize");
class RoleModel extends sequelize_1.Model {
}
exports.RoleModel = RoleModel;
function load(sequelize) {
    return RoleModel.init({
        id: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
        },
        roleName: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        menu: {
            type: new sequelize_1.DataTypes.JSON(),
            allowNull: true,
        },
        cornerMenu: {
            type: new sequelize_1.DataTypes.JSON(),
            allowNull: true,
        },
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: "roles",
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    });
}
function associates(models) {
    // models.Role.hasMany(models.User, {
    //   sourceKey: 'id',
    //   foreignKey: 'roleId',
    //   as: 'users',
    // })
}
exports.default = {
    load,
    associates,
};
