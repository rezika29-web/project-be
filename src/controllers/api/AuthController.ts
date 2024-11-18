import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { Op } from "sequelize"
import jwt from "jsonwebtoken"
import sha1 from "sha1"
import config from "../../config/AllConfig"
import ApiController from "../../core/ApiController"
import { badRequest, notFound } from "../../helpers/ErrorHelper"
import UserController from "./UserController"

const { ACCESS_KEY, ACCESS_EXP } = config.envy

export default class AuthController extends ApiController {
  async handleLogin(req: Request, res: Response) {
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

    const { nip, password } = req.body

    if (!nip) throw badRequest("nip required")
    if (!password) throw badRequest("Password required")

    const { User } = DB_PRIMARY

    const user = await User.findOne({
      where: {
        [Op.or]: [{ nip }, { nip: nip }],
      },
      include: [User.associations.role],
    })

    if (!user) throw notFound("User not found")

    const encryptedPassword = sha1(password)
    if (user.password !== encryptedPassword) {
      throw badRequest("Invalid password")
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        photo: user?.photo,
        phoneNumber: user?.phoneNumber,
        nip: user.nip,
        roleId: user.roleId,
        role: user.role,
      },
      ACCESS_KEY,
      { expiresIn: ACCESS_EXP }
    )

    const duration = ACCESS_EXP
    const { iat, exp }: any = jwt.verify(accessToken, ACCESS_KEY)

    res.cookie("accessToken", accessToken)
    res.json({
      message: "Login success",
      accessToken,
      duration,
      iat,
      exp,
    })
  }

  async handleLogout(req: Request, res: Response) {
    /* #swagger.tags = ['Auth'] */
    res.cookie("accessToken", null)
    res.json({ message: "Logout success" })
  }

  async handleMyAccount(req: Request, res: Response) {
    /* #swagger.tags = ['Auth'] */

    const { User } = DB_PRIMARY
    const { userActive } = res.locals

    const user = await User.findByPk(userActive.id, {
      include: [User.associations.role],
    })
    if (!user) throw notFound("User not found")

    res.json({
      message: "Read My Account success",
      userActive: user,
    })
  }
  async handleGetMyAccount(req: Request, res: Response) {
    /* #swagger.tags = ['Auth'] */

    const { User } = DB_PRIMARY
    const { userActive } = res.locals

    const users = await User.findAll({
      where: { id: userActive.id },
      include: [User.associations.role]
    });
    if (!users) throw notFound("User not found")

    res.json({
      message: "Read My Account success",
      userActive: users,
    })
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

  async handleUpdateMyAccount(req: Request, res: Response) {
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

    const { userActive } = res.locals

    const { id } = userActive
    const { fullName, photo, phoneNumber, nip, roleId } = req.body
    const { User, Role } = DB_PRIMARY

    const user = await User.findByPk(id)
    if (!user) throw notFound("User not found")

    if (!fullName) throw badRequest("First Name required")

    if (!nip) throw badRequest("nip required")
    if (!phoneNumber) throw badRequest("Phone Number required")

    if (!nip.isValidnip()) {
      throw badRequest("Invalid nip format")
    }

    if (nip !== user.nip) {
      const userBynip = await User.findOne({
        where: {
          nip,
        },
      })

      if (userBynip) {
        throw badRequest("A User with the same nip already exists")
      }
    }

    if (!roleId) throw badRequest("Role ID required")

    const role = await Role.findByPk(roleId)
    if (!role) throw notFound("Role not found")

    await user.update({
      id,
      fullName,
      photo,
      phoneNumber,
      nip,
      roleId,
    })

    res.json({
      message: "Update data success",
    })
  }

  async handleUpdatePassword(req: Request, res: Response) {
    /* #swagger.tags = ['Auth'] */

    const { userActive } = res.locals

    const { id } = userActive
    const { oldPassword, newPassword, retypePassword } = req.body
    const { User, Role } = DB_PRIMARY

    const user = await User.findByPk(id)
    if (!user) throw notFound("User not found")

    if (!oldPassword) throw badRequest("Old Password required")
    if (!newPassword) throw badRequest("New Password required")
    if (!retypePassword) throw badRequest("retype Password required")
    if (retypePassword !== newPassword) {
      throw badRequest("New Password tidak sama dengan Retype Password")
    }
    if (sha1(oldPassword) !== user.password) {
      throw badRequest("Old Password tidak sama dengan Password tersedia")
    }

    const salt = sha1("salt-" + uuidv4())
    const password = sha1(newPassword + salt)

    await user.update({
      id,
      salt,
      password,
    })

    res.json({
      message: "Update data success",
    })
  }
}
