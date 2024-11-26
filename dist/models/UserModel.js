"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
class UserModel extends sequelize_1.Model {
}
exports.UserModel = UserModel;
function load(sequelize) {
    return UserModel.init({
        id: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
        },
        fullName: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        photo: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        password: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        nip: {
            type: new sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        phoneNumber: {
            type: new sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        roleId: {
            type: new sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: sequelize_1.DataTypes.DATE,
        updatedAt: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    });
}
function associates(models) {
    models.User.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
    });
}
exports.default = {
    load,
    associates,
};
