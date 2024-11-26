"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sha1_1 = __importDefault(require("sha1"));
const AllConfig_1 = __importDefault(require("../../config/AllConfig"));
const ApiController_1 = __importDefault(require("../../core/ApiController"));
const ErrorHelper_1 = require("../../helpers/ErrorHelper");
const { ACCESS_KEY, ACCESS_EXP } = AllConfig_1.default.envy;
class AuthController extends ApiController_1.default {
    handleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            #swagger.tags = ['Auth']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["nip", "password"],
                    properties: {
                      nip: {
                        type: "string",
                      },
                      password: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            }
            */
            const { nip, password } = req.body;
            if (!nip)
                throw (0, ErrorHelper_1.badRequest)("nip required");
            if (!password)
                throw (0, ErrorHelper_1.badRequest)("Password required");
            const { User } = DB_PRIMARY;
            const user = yield User.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ nip }, { nip: nip }],
                },
                include: [User.associations.role],
            });
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            const encryptedPassword = (0, sha1_1.default)(password);
            if (user.password !== encryptedPassword) {
                throw (0, ErrorHelper_1.badRequest)("Invalid password");
            }
            const accessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                fullName: user.fullName,
                photo: user === null || user === void 0 ? void 0 : user.photo,
                phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
                nip: user.nip,
                roleId: user.roleId,
                role: user.role,
            }, ACCESS_KEY, { expiresIn: ACCESS_EXP });
            const duration = ACCESS_EXP;
            const { iat, exp } = jsonwebtoken_1.default.verify(accessToken, ACCESS_KEY);
            res.cookie("accessToken", accessToken);
            res.json({
                message: "Login success",
                accessToken,
                duration,
                iat,
                exp,
            });
        });
    }
    handleLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Auth'] */
            res.cookie("accessToken", null);
            res.json({ message: "Logout success" });
        });
    }
    handleMyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Auth'] */
            const { User } = DB_PRIMARY;
            const { userActive } = res.locals;
            const user = yield User.findByPk(userActive.id, {
                include: [User.associations.role],
            });
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            res.json({
                message: "Read My Account success",
                userActive: user,
            });
        });
    }
    handleGetMyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Auth'] */
            const { User } = DB_PRIMARY;
            const { userActive } = res.locals;
            const users = yield User.findAll({
                where: { id: userActive.id },
                include: [User.associations.role]
            });
            if (!users)
                throw (0, ErrorHelper_1.notFound)("User not found");
            res.json({
                message: "Read My Account success",
                userActive: users,
            });
        });
    }
    // async handleMyAccount(req: Request, res: Response) {
    //   /* #swagger.tags = ['Auth'] */
    //   const { User, Role } = DB_PRIMARY
    //   const { userActive } = res.locals
    //   const user = await User.findByPk(userActive.id, {
    //     include: [User.associations.role],
    //   })
    //   if (!user) throw notFound("User not found")
    //   const role = await Role.findByPk(user.roleId)
    //   if (!role) throw notFound("Role not found")
    //   const roleData = role.toJSON();
    //   delete roleData.permissionJson;
    //   const permission: Record<string, PermissionObject> = JSON.parse(role.permissionJson);
    //   const expandedPermission: Record<string, PermissionObject> = {};
    //   interface PermissionObject {
    //     showMenu: boolean;
    //     create: boolean;
    //     read: boolean;
    //     update: boolean;
    //     delete: boolean;
    //     export: boolean;
    //   }
    //   completePermissions.forEach(perm => {
    //     expandedPermission[perm] = permission[perm] || {
    //       showMenu: false,
    //       create: false,
    //       read: false,
    //       update: false,
    //       delete: false,
    //       export: false,
    //     };
    //   });
    //   delete roleData.permissionJson;
    //   // Configure MinIO client
    //   const minioClient = new Client({
    //     endPoint: config.envy.MINIO_ENDPOINT,
    //     port: config.envy.MINIO_PORT,
    //     useSSL: config.envy.MINIO_USE_SSL === 'true',
    //     accessKey: config.envy.MINIO_ACCESS_KEY,
    //     secretKey: config.envy.MINIO_SECRET_KEY,
    //   });
    //   // Generate presigned URL (1 hour expiry)
    //   let profpicUrl = null;
    //   if (user.profilePictureFile) {
    //     profpicUrl = await minioClient.presignedGetObject('bpsdm', user.profilePictureFile, 60 * 60);
    //   }
    //   res.json({
    //     message: "Read success",
    //     user: {
    //       ...user.toJSON(),
    //       profilePictureFile: profpicUrl,
    //     },
    //     role: {
    //       ...roleData,
    //       permission: expandedPermission
    //     },
    //   })
    // }
    handleUpdateMyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            #swagger.tags = ['Auth']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["fullName", "nip", "roleId"],
                    properties: {
                      fullName: {
                        type: "string",
                      },
                      photo: {
                        type: "string",
                      },
                      nip: {
                        type: "string",
                      },
                      roleId: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            }
            */
            const { userActive } = res.locals;
            const { id } = userActive;
            const { fullName, photo, phoneNumber, nip, roleId } = req.body;
            const { User, Role } = DB_PRIMARY;
            const user = yield User.findByPk(id);
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            if (!fullName)
                throw (0, ErrorHelper_1.badRequest)("First Name required");
            if (!nip)
                throw (0, ErrorHelper_1.badRequest)("nip required");
            if (!phoneNumber)
                throw (0, ErrorHelper_1.badRequest)("Phone Number required");
            if (!nip.isValidnip()) {
                throw (0, ErrorHelper_1.badRequest)("Invalid nip format");
            }
            if (nip !== user.nip) {
                const userBynip = yield User.findOne({
                    where: {
                        nip,
                    },
                });
                if (userBynip) {
                    throw (0, ErrorHelper_1.badRequest)("A User with the same nip already exists");
                }
            }
            if (!roleId)
                throw (0, ErrorHelper_1.badRequest)("Role ID required");
            const role = yield Role.findByPk(roleId);
            if (!role)
                throw (0, ErrorHelper_1.notFound)("Role not found");
            yield user.update({
                id,
                fullName,
                photo,
                phoneNumber,
                nip,
                roleId,
            });
            res.json({
                message: "Update data success",
            });
        });
    }
    handleUpdatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Auth'] */
            const { userActive } = res.locals;
            const { id } = userActive;
            const { oldPassword, newPassword, retypePassword } = req.body;
            const { User, Role } = DB_PRIMARY;
            const user = yield User.findByPk(id);
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            if (!oldPassword)
                throw (0, ErrorHelper_1.badRequest)("Old Password required");
            if (!newPassword)
                throw (0, ErrorHelper_1.badRequest)("New Password required");
            if (!retypePassword)
                throw (0, ErrorHelper_1.badRequest)("retype Password required");
            if (retypePassword !== newPassword) {
                throw (0, ErrorHelper_1.badRequest)("New Password tidak sama dengan Retype Password");
            }
            if ((0, sha1_1.default)(oldPassword) !== user.password) {
                throw (0, ErrorHelper_1.badRequest)("Old Password tidak sama dengan Password tersedia");
            }
            const salt = (0, sha1_1.default)("salt-" + (0, uuid_1.v4)());
            const password = (0, sha1_1.default)(newPassword + salt);
            yield user.update({
                id,
                salt,
                password,
            });
            res.json({
                message: "Update data success",
            });
        });
    }
}
exports.default = AuthController;
