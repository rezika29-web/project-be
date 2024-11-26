"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("./UserModel"));
const RoleModel_1 = __importDefault(require("./RoleModel"));
const FileModel_1 = __importDefault(require("./FileModel"));
class AllModel {
    load(sequelize) {
        const User = UserModel_1.default.load(sequelize);
        const Role = RoleModel_1.default.load(sequelize);
        const File = FileModel_1.default.load(sequelize);
        const models = {
            User,
            Role,
            File,
        };
        UserModel_1.default.associates(models);
        RoleModel_1.default.associates(models);
        FileModel_1.default.associates(models);
        return models;
    }
}
exports.default = AllModel;
