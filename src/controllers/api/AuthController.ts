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
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user?.photo,
        phoneNumber: user?.phoneNumber,
        username: user.username,
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

  async handleUpdateMyAccount(req: Request, res: Response) {
    /* 
    #swagger.tags = ['Auth']
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
              photo: {
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

    const { userActive } = res.locals

    const { id } = userActive
    const { firstName, lastName, photo, phoneNumber, username, nip, roleId } = req.body
    const { User, Role } = DB_PRIMARY

    const user = await User.findByPk(id)
    if (!user) throw notFound("User not found")

    if (!firstName) throw badRequest("First Name required")
    if (!username) throw badRequest("Username required")

    if (username !== user.username) {
      const userByUsername = await User.findOne({
        where: {
          username,
        },
      })

      if (userByUsername) {
        throw badRequest("A User with the same Username already exists")
      }
    }

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
      firstName,
      lastName,
      photo,
      phoneNumber,
      username,
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