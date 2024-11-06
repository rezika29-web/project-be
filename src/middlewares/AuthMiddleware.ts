import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import config from "../config/AllConfig"
import { accessDenied } from "../helpers/ErrorHelper"

const { ACCESS_KEY } = config.envy

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken } = req.cookies
  const { authorization } = req.headers

  let token
  if (accessToken) {
    token = accessToken
  } else if (authorization) {
    if (authorization.substr(0, 6) !== "Bearer") {
      throw accessDenied()
    }
    token = authorization.replace("Bearer ", "")
  }
  
  let userActive

  try {
    userActive = jwt.verify(token, ACCESS_KEY)
  } catch (err) {
    console.log(err)
    throw accessDenied()
  }

  res.locals.userActive = userActive

  next()
}
