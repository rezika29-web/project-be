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
const sha1_1 = __importDefault(require("sha1"));
const sequelize_1 = require("sequelize");
const ApiController_1 = __importDefault(require("../../core/ApiController"));
const ErrorHelper_1 = require("../../helpers/ErrorHelper");
class UserController extends ApiController_1.default {
    buildCriteria({ fullName, nip, roleId, keyword, }) {
        let criteria = {};
        if (fullName) {
            criteria = Object.assign(Object.assign({}, criteria), { fullName: {
                    [sequelize_1.Op.like]: `${fullName}%`,
                } });
        }
        if (nip) {
            criteria = Object.assign(Object.assign({}, criteria), { nip: {
                    [sequelize_1.Op.like]: `${nip}%`,
                } });
        }
        if (roleId) {
            criteria = Object.assign(Object.assign({}, criteria), { roleId });
        }
        if (keyword) {
            criteria = Object.assign(Object.assign({}, criteria), { [sequelize_1.Op.or]: [
                    {
                        fullName: {
                            [sequelize_1.Op.like]: `${keyword}%`,
                        },
                    },
                    {
                        nip: {
                            [sequelize_1.Op.like]: `${keyword}%`,
                        },
                    },
                ] });
        }
        return criteria;
    }
    handleReadAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['User'] */
            const { User } = DB_PRIMARY;
            const where = this.buildCriteria(req.query);
            const users = yield User.findAll({
                attributes: { exclude: ["password"] },
                where,
                order: [["fullName", "ASC"]],
                // include: [User.associations.role],
            });
            res.json({
                message: "Read data success",
                users,
            });
        });
    }
    handleReadPaginate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['User'] */
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const offset = (page - 1) * pageSize;
            const limit = pageSize;
            const { User } = DB_PRIMARY;
            const where = this.buildCriteria(req.query);
            const data = yield User.findAndCountAll({
                attributes: { exclude: ["password"] },
                where,
                include: [User.associations.role],
                order: [["fullName", "ASC"]],
                offset,
                limit,
            });
            const count = data.count;
            const pageNum = Math.ceil(count / pageSize);
            const users = data.rows;
            res.json({
                message: "Read data success",
                count,
                users,
                page,
                pageSize,
                pageNum,
            });
        });
    }
    handleReadOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['User'] */
            const { id } = req.params;
            const { User } = DB_PRIMARY;
            const user = yield User.findByPk(id, {
                attributes: { exclude: ["password"] },
                include: [User.associations.role],
            });
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            res.json({
                message: "Read data success",
                user,
            });
        });
    }
    handleDeleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['User'] */
            const { id } = req.params;
            const { User, Blok, AnalisaKolam } = DB_PRIMARY;
            const user = yield User.findByPk(id);
            if (!user)
                throw (0, ErrorHelper_1.badRequest)("User not found");
            const cekData = yield Blok.findAll({
                where: {
                    [sequelize_1.Op.or]: [{ teknisiId: id }, { kepalaId: id }, { supervisiId: id }],
                },
            });
            if (cekData.length > 0)
                throw (0, ErrorHelper_1.badRequest)("User Relasi Dengan Blok : " + cekData[0].namaBlok);
            const cekData1 = yield AnalisaKolam.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { adminLabId: id },
                        { teknisiId: id },
                        { kepalaId: id },
                        { supervisiId: id },
                        { koordinator1Id: id },
                        { koordinator2Id: id },
                        { koordinator3Id: id },
                    ],
                },
                include: [AnalisaKolam.associations.kolam],
            });
            if (cekData1.length > 0)
                throw (0, ErrorHelper_1.badRequest)("User Relasi Dengan Analisa Kolam : " + cekData[0].namaKolam);
            yield user.destroy();
            res.json({
                message: "Delete data success",
            });
        });
    }
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            #swagger.tags = ['User']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["fullName", "", "nip", "password", "retypePassword", "roleId"],
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
                      password: {
                        type: "string",
                      },
                      retypePassword: {
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
            const { fullName, nip, phoneNumber, password, retypePassword, roleId, } = req.body;
            const { User, Role } = DB_PRIMARY;
            // Validate
            if (!fullName)
                throw (0, ErrorHelper_1.badRequest)("Full Name required");
            if (!nip)
                throw (0, ErrorHelper_1.badRequest)("Nip required");
            if (!nip.isValidNip()) {
                throw (0, ErrorHelper_1.badRequest)("Invalid Nip format");
            }
            const userBy = yield User.findOne({
                where: {
                    nip,
                },
            });
            if (userBy) {
                throw (0, ErrorHelper_1.badRequest)("A NIP with the same  already exists");
            }
            if (!phoneNumber)
                throw (0, ErrorHelper_1.badRequest)("Phone Number required");
            const userByNip = yield User.findOne({
                where: {
                    nip,
                },
            });
            if (userByNip) {
                throw (0, ErrorHelper_1.badRequest)("A User with the same NIP already exists");
            }
            if (!password)
                throw (0, ErrorHelper_1.badRequest)("Password required");
            if (!retypePassword)
                throw (0, ErrorHelper_1.badRequest)("Retype Password required");
            if (password !== retypePassword) {
                throw (0, ErrorHelper_1.badRequest)("Retype the password with the same password");
            }
            if (!roleId)
                throw (0, ErrorHelper_1.badRequest)("Role ID required");
            const role = yield Role.findByPk(roleId);
            if (!role)
                throw (0, ErrorHelper_1.notFound)("Role not found");
            const id = (0, uuid_1.v4)();
            const salt = (0, sha1_1.default)((0, uuid_1.v4)());
            const newPassword = (0, sha1_1.default)(password);
            yield User.create({
                id,
                fullName,
                nip,
                phoneNumber,
                password: newPassword,
                roleId,
            });
            res.status(201).json({
                message: "Create new data success",
                id,
            });
        });
    }
    handleUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            #swagger.tags = ['User']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["fullName","nip", "roleId"],
                    properties: {
                      fullName: {
                        type: "string",
                      },
                      phoneNumber: {
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
            res.status(201).json({
                message: "Create new data success",
                req,
            });
            // const { id } = req.params;
            // const { fullName, nip, roleId, phoneNumber } =
            // req.body;
            // const { User, Role } = DB_PRIMARY;
            // const user = await User.findByPk(id);
            // if (!user) throw notFound("User not found");
            // if (!fullName) throw badRequest("Full Name required");
            // if (!phoneNumber) throw badRequest("Phone Number required");
            // if (!nip) throw badRequest("nip required");
            // if (!nip.isValidNip()) {
            //   throw badRequest("Invalid Nip format");
            // }
            // if (nip !== user.nip) {
            //   const userByNip = await User.findOne({
            //     where: {
            //       nip,
            //     },
            //   });
            //   if (userByNip) {
            //     throw badRequest("A User with the same Nip already exists");
            //   }
            // }
            // if (!roleId) throw badRequest("Role ID required");
            // const role = await Role.findByPk(roleId);
            // if (!role) throw notFound("Role not found");
            // await user.update({
            //   id,
            //   fullName,
            //   nip,
            //   phoneNumber,
            //   roleId,
            // });
            // res.json({
            //   message: "Update data success",
            // });
        });
    }
    handleResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['User'] */
            const { id } = req.params;
            const { User } = DB_PRIMARY;
            const user = yield User.findByPk(id);
            if (!user)
                throw (0, ErrorHelper_1.notFound)("User not found");
            const salt = (0, sha1_1.default)((0, uuid_1.v4)());
            const password = (0, sha1_1.default)("123456");
            yield user.update({
                id,
                password,
            });
            res.json({
                message: "Reset Password data success",
            });
        });
    }
}
exports.default = UserController;
