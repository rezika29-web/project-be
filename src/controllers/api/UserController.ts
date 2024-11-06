import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import sha1 from "sha1";
import { Op, Sequelize } from "sequelize";
import ApiController from "../../core/ApiController";
import { badRequest, notFound } from "../../helpers/ErrorHelper";
import { UserModel } from "../../models/UserModel";

export default class UserController extends ApiController {
  buildCriteria({
    firstName,
    lastName,
    username,
    nip,
    roleId,
    keyword,
  }: Partial<UserModel> & { keyword?: string }) {
    let criteria = {};

    if (firstName) {
      criteria = {
        ...criteria,
        firstName: {
          [Op.like]: `${firstName}%`,
        },
      };
    }

    if (lastName) {
      criteria = {
        ...criteria,
        lastName: {
          [Op.like]: `${lastName}%`,
        },
      };
    }

    if (nip) {
      criteria = {
        ...criteria,
        nip: {
          [Op.like]: `${nip}%`,
        },
      };
    }

    if (username) {
      criteria = {
        ...criteria,
        username: {
          [Op.like]: `${username}%`,
        },
      };
    }

    if (roleId) {
      criteria = {
        ...criteria,
        roleId,
      };
    }

    if (keyword) {
      criteria = {
        ...criteria,
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `${keyword}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `${keyword}%`,
            },
          },
          {
            username: {
              [Op.like]: `${keyword}%`,
            },
          },
          {
            nip: {
              [Op.like]: `${keyword}%`,
            },
          },
        ],
      };
    }

    return criteria;
  }

  async handleReadAll(req: Request, res: Response) {
    /* #swagger.tags = ['User'] */

    const { User } = DB_PRIMARY;
    const where = this.buildCriteria(req.query);
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      where,
      order: [["firstName", "ASC"]],
      // include: [User.associations.role],
    });

    res.json({
      message: "Read data success",
      users,
    });
  }

  async handleReadPaginate(req: Request, res: Response) {
    /* #swagger.tags = ['User'] */

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { User } = DB_PRIMARY;

    const where = this.buildCriteria(req.query);
    const data = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      where,
      include: [User.associations.role],
      order: [["firstName", "ASC"]],
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
  }

  async handleReadOne(req: Request, res: Response) {
    /* #swagger.tags = ['User'] */
    const { id } = req.params;
    const { User } = DB_PRIMARY;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [User.associations.role],
    });
    if (!user) throw notFound("User not found");

    res.json({
      message: "Read data success",
      user,
    });
  }

  async handleDeleteOne(req: Request, res: Response) {
    /* #swagger.tags = ['User'] */
    const { id } = req.params;
    const { User, Blok, AnalisaKolam } = DB_PRIMARY;

    const user = await User.findByPk(id);
    if (!user) throw badRequest("User not found");

    const cekData = await Blok.findAll({
      where: {
        [Op.or]: [{ teknisiId: id }, { kepalaId: id }, { supervisiId: id }],
      },
    });

    if (cekData.length > 0)
      throw badRequest("User Relasi Dengan Blok : " + cekData[0].namaBlok);

    const cekData1 = await AnalisaKolam.findAll({
      where: {
        [Op.or]: [
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
      throw badRequest(
        "User Relasi Dengan Analisa Kolam : " + cekData[0].namaKolam
      );

    await user.destroy();

    res.json({
      message: "Delete data success",
    });
  }

  async handleCreate(req: Request, res: Response) {
    /* 
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["firstName", "username", "nip", "password", "retypePassword", "roleId"],
            properties: {
              firstName: {
                type: "string",
              },
              lastName: {
                type: "string",
              },
              photo: {
                type: "string",
              },
              username: {
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

    const {
      firstName,
      lastName,
      username,
      nip,
      phoneNumber,
      password,
      retypePassword,
      roleId,
    } = req.body;

    const { User, Role } = DB_PRIMARY;

    // Validate

    if (!firstName) throw badRequest("First Name required");

    if (!username) throw badRequest("Username required");

    const userByUsername = await User.findOne({
      where: {
        username,
      },
    });

    if (userByUsername) {
      throw badRequest("A User with the same Username already exists");
    }

    if (!phoneNumber) throw badRequest("Phone Number required");

    if (!nip) throw badRequest("Nip required");

    if (!nip.isValidNip()) {
      throw badRequest("Invalid Nip format");
    }

    const userByNip = await User.findOne({
      where: {
        nip,
      },
    });

    if (userByNip) {
      throw badRequest("A User with the same NIP already exists");
    }

    if (!password) throw badRequest("Password required");
    if (!retypePassword) throw badRequest("Retype Password required");

    if (password !== retypePassword) {
      throw badRequest("Retype the password with the same password");
    }

    if (!roleId) throw badRequest("Role ID required");

    const role = await Role.findByPk(roleId);
    if (!role) throw notFound("Role not found");

    const id = uuidv4();

    const salt = sha1(uuidv4());
    const newPassword = sha1(password);

    await User.create({
      id,
      firstName,
      lastName,
      username,
      nip,
      phoneNumber,
      password: newPassword,
      roleId,
    });

    res.status(201).json({
      message: "Create new data success",
      id,
    });
  }

  async handleUpdate(req: Request, res: Response) {
    /* 
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["firstName", "username", "nip", "roleId"],
            properties: {
              firstName: {
                type: "string",
              },
              lastName: {
                type: "string",
              },
              username: {
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

    const { id } = req.params;
    const { firstName, lastName, username, nip, roleId, phoneNumber } =
      req.body;
    const { User, Role } = DB_PRIMARY;

    const user = await User.findByPk(id);
    if (!user) throw notFound("User not found");

    if (!firstName) throw badRequest("First Name required");
    if (!username) throw badRequest("Username required");
    if (!phoneNumber) throw badRequest("Phone Number required");

    if (username !== user.username) {
      const userByUsername = await User.findOne({
        where: {
          username,
        },
      });

      if (userByUsername) {
        throw badRequest("A User with the same Username already exists");
      }
    }

    if (!nip) throw badRequest("nip required");

    if (!nip.isValidNip()) {
      throw badRequest("Invalid Nip format");
    }

    if (nip !== user.nip) {
      const userByNip = await User.findOne({
        where: {
          nip,
        },
      });

      if (userByNip) {
        throw badRequest("A User with the same Nip already exists");
      }
    }

    if (!roleId) throw badRequest("Role ID required");

    const role = await Role.findByPk(roleId);
    if (!role) throw notFound("Role not found");

    await user.update({
      id,
      firstName,
      lastName,
      username,
      nip,
      phoneNumber,
      roleId,
    });

    res.json({
      message: "Update data success",
    });
  }

  async handleResetPassword(req: Request, res: Response) {
    /* #swagger.tags = ['User'] */
    
    const { id } = req.params;
    const { User } = DB_PRIMARY;

    const user = await User.findByPk(id);
    if (!user) throw notFound("User not found");

    const salt = sha1(uuidv4());
    const password = sha1("123456");

    await user.update({
      id,
      password,
    });

    res.json({
      message: "Reset Password data success",
    });
  }
}