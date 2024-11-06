import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { Op } from "sequelize"
import ApiController from "../../core/ApiController"
import { badRequest, notFound } from "../../helpers/ErrorHelper"
import { RoleModel } from "../../models/RoleModel"

export default class RoleController extends ApiController {

  buildCriteria({ roleName,
    keyword }: Partial<RoleModel>& { keyword?: string }) {
    let criteria = {}
    if (roleName) {
      criteria = {
        ...criteria,
        roleName: {
          [Op.like]: `${roleName}%`,
        },
      }
    }
    if (keyword) {
      criteria = {
        ...criteria,
        [Op.or]: [
          {
            roleName: {
              [Op.like]: `${keyword}%`,
            },
          },
        ],
      };
    }
    return criteria
  }

  async handleReadAll(req: Request, res: Response) {
    /* #swagger.tags = ['Role'] */
    
    const { Role } = DB_PRIMARY

    const where = this.buildCriteria(req.query)
    const roles = await Role.findAll({ where,order: [["roleName", "ASC"]] })

    res.json({
      message: "Read data success",
      roles,
    })
  }

  async handleReadPaginate(req: Request, res: Response) {
    /* #swagger.tags = ['Role'] */

    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10

    const offset = (page - 1) * pageSize
    const limit = pageSize

    const { Role } = DB_PRIMARY

    const where = this.buildCriteria(req.query)
    const data = await Role.findAndCountAll({
      where,
      order: [["roleName", "ASC"]],
      offset,
      limit,
    })

    const count = data.count
    const pageNum = Math.ceil(count / pageSize)
    const roles = data.rows

    res.json({
      message: "Read data success",
      count,
      roles,
      page,
      pageSize,
      pageNum,
    })
  }

  async handleReadOne(req: Request, res: Response) {
    /* #swagger.tags = ['Role'] */
    const { id } = req.params
    const { Role } = DB_PRIMARY

    const role = await Role.findByPk(id)
    if (!role) throw notFound("Role not found")

    res.json({
      message: "Read data success",
      role,
    })
  }

  async handleDeleteOne(req: Request, res: Response) {
    /* #swagger.tags = ['Role'] */
    const { id } = req.params
    const { Role,User } = DB_PRIMARY

    const role = await Role.findByPk(id)
    if (!role) throw notFound("Role not found")


    const cekData = await User.findAll({
      where: { roleId: id },
    });

    if (cekData.length > 0)
      throw badRequest(
        "Role Relasi Dengan User : " + cekData[0].username
      );

    await role.destroy()

    res.json({
      message: "Delete data success",
    })
  }

  async handleCreate(req: Request, res: Response) {
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

    const { roleName, menu, cornerMenu } = req.body
    const { Role } = DB_PRIMARY

    if (!roleName) throw badRequest("Role name required")
    if (!menu) throw badRequest("Menu required")

    const role = await Role.findOne({
      where: {
        roleName,
      },
    })

    if (role) throw badRequest("A Role with the same Name already exists")

    const id = uuidv4()

    await Role.create({
      id,
      roleName,
      menu,
      cornerMenu,
    })

    res.status(201).json({
      message: "Create new data success",
      id,
    })
  }

  async handleUpdate(req: Request, res: Response) {
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

    const { id } = req.params
    const { roleName, menu, cornerMenu } = req.body
    const { Role } = DB_PRIMARY

    if (!roleName) throw badRequest("Role name required")
    if (!menu) throw badRequest("Menu required")

    const role = await Role.findByPk(id)

    if (!role) throw notFound("Role not found")

    await role.update({
      roleName,
      menu,
      cornerMenu,
    })

    res.json({
      message: "Update data success",
    })
  }
}
