import { Router, Request, Response } from "express"
import SystemRouter from "./SystemRouter"
import AuthRouter from "./AuthRouter"
import RoleRouter from "./RoleRouter"
import UserRouter from "./UserRouter"
import FileRouter from "./FileRouter"

const router = Router()

router.get("/", (req: Request, res: Response) => {
  const { APP_NAME, APP_VERSION } = process.env

  res.json({
    APP_NAME,
    APP_VERSION,
  })
})

router.use(SystemRouter)
router.use(AuthRouter)
router.use(RoleRouter)
router.use(UserRouter)
router.use(FileRouter)

export = router
