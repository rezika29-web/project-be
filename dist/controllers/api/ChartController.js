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
const ApiController_1 = __importDefault(require("../../core/ApiController"));
const ErrorHelper_1 = require("../../helpers/ErrorHelper");
class RoleController extends ApiController_1.default {
    buildCriteria({ roleName, keyword }) {
        let criteria = {};
        if (roleName) {
            criteria = Object.assign(Object.assign({}, criteria), { roleName: {
                    [sequelize_1.Op.like]: `${roleName}%`,
                } });
        }
        if (keyword) {
            criteria = Object.assign(Object.assign({}, criteria), { [sequelize_1.Op.or]: [
                    {
                        roleName: {
                            [sequelize_1.Op.like]: `${keyword}%`,
                        },
                    },
                ] });
        }
        return criteria;
    }
    handleReadAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Role'] */
            const { Role } = DB_PRIMARY;
            const where = this.buildCriteria(req.query);
            const roles = yield Role.findAll({ where, order: [["roleName", "ASC"]] });
            res.json({
                message: "Read data success",
                roles,
            });
        });
    }
    handleReadPaginate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Role'] */
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;
            const offset = (page - 1) * pageSize;
            const limit = pageSize;
            const { Role } = DB_PRIMARY;
            const where = this.buildCriteria(req.query);
            const data = yield Role.findAndCountAll({
                where,
                order: [["roleName", "ASC"]],
                offset,
                limit,
            });
            const count = data.count;
            const pageNum = Math.ceil(count / pageSize);
            const roles = data.rows;
            res.json({
                message: "Read data success",
                count,
                roles,
                page,
                pageSize,
                pageNum,
            });
        });
    }
    handleReadOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Role'] */
            const { id } = req.params;
            const { Role } = DB_PRIMARY;
            const role = yield Role.findByPk(id);
            if (!role)
                throw (0, ErrorHelper_1.notFound)("Role not found");
            res.json({
                message: "Read data success",
                role,
            });
        });
    }
    handleDeleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* #swagger.tags = ['Role'] */
            const { id } = req.params;
            const { Role, User } = DB_PRIMARY;
            const role = yield Role.findByPk(id);
            if (!role)
                throw (0, ErrorHelper_1.notFound)("Role not found");
            const cekData = yield User.findAll({
                where: { roleId: id },
            });
            if (cekData.length > 0)
                throw (0, ErrorHelper_1.badRequest)("Role Relasi Dengan User : " + cekData[0].username);
            yield role.destroy();
            res.json({
                message: "Delete data success",
            });
        });
    }
    handleCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            #swagger.tags = ['Role']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["roleName", "menu"],
                    properties: {
                      roleName: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      menu: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            menuName: {
                              type: 'string',
                            },
                            slug: {
                              type: 'string',
                            },
                            isChecked: {
                              type: 'boolean',
                            },
                          },
                        }
                      },
                      cornerMenu: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            menuName: {
                              type: 'string',
                            },
                            slug: {
                              type: 'string',
                            },
                            isChecked: {
                              type: 'boolean',
                            },
                          },
                        }
                      },
                    },
                  },
                },
              },
            }
            */
            const { roleName, description, menu, cornerMenu } = req.body;
            const { Role } = DB_PRIMARY;
            if (!roleName)
                throw (0, ErrorHelper_1.badRequest)("Role name required");
            if (!description)
                throw (0, ErrorHelper_1.badRequest)("Description name required");
            // if (!menu) throw badRequest("Menu required")
            const role = yield Role.findOne({
                where: {
                    roleName,
                },
            });
            if (role)
                throw (0, ErrorHelper_1.badRequest)("A Role with the same Name already exists");
            const id = (0, uuid_1.v4)();
            yield Role.create({
                id,
                roleName,
                description,
                menu,
                cornerMenu,
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
            #swagger.tags = ['Role']
            #swagger.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["roleName","description", "menu"],
                    properties: {
                      roleName: {
                        type: "string",
                      },
                       description: {
                        type: "string",
                      },
                      menu: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            menuName: {
                              type: 'string',
                            },
                            slug: {
                              type: 'string',
                            },
                            isChecked: {
                              type: 'boolean',
                            },
                          },
                        }
                      },
                      cornerMenu: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            menuName: {
                              type: 'string',
                            },
                            slug: {
                              type: 'string',
                            },
                            isChecked: {
                              type: 'boolean',
                            },
                          },
                        }
                      },
                    },
                  },
                },
              },
            }
            */
            const { id } = req.params;
            const { roleName, description, menu, cornerMenu } = req.body;
            const { Role } = DB_PRIMARY;
            if (!roleName)
                throw (0, ErrorHelper_1.badRequest)("Role name required");
            if (!menu)
                throw (0, ErrorHelper_1.badRequest)("Menu required");
            const role = yield Role.findByPk(id);
            if (!role)
                throw (0, ErrorHelper_1.notFound)("Role not found");
            yield role.update({
                roleName,
                description,
                menu,
                cornerMenu,
            });
            res.json({
                message: "Update data success",
            });
        });
    }
}
exports.default = RoleController;
