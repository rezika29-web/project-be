import { Router } from "express"
import asyncHandler from "express-async-handler"
import AuthMiddleware from "../../middlewares/AuthMiddleware"
import AuthController from "../../controllers/api/AuthController"

const router = Router()
const controller = new AuthController()

router.post(
  "/auth/login",
  asyncHandler(controller.handleLogin.bind(controller))
)
router.get(
  "/auth/logout",
  AuthMiddleware,
  asyncHandler(controller.handleLogout.bind(controller))
)
router.get(
  "/auth/my-account",
  AuthMiddleware,
  asyncHandler(controller.handleMyAccount.bind(controller))
)
router.put(
  "/auth/my-account",
  AuthMiddleware,
  asyncHandler(controller.handleUpdateMyAccount.bind(controller))
)

router.put(
  "/auth/my-account/update-password",
  AuthMiddleware,
  asyncHandler(controller.handleUpdatePassword.bind(controller))
)

export = router
