import { Router } from "express"
import asyncHandler from "express-async-handler"
import AuthMiddleware from "../../middlewares/AuthMiddleware"
import UserController from "../../controllers/api/UserController"

const router = Router()
const controller = new UserController()

router.get(
  "/users/all",
  AuthMiddleware,
  asyncHandler(controller.handleReadAll.bind(controller))
)

router.get(
  "/users",
  AuthMiddleware,
  asyncHandler(controller.handleReadPaginate.bind(controller))
)

router.get(
  "/users/:id",
  AuthMiddleware,
  asyncHandler(controller.handleReadOne.bind(controller))
)

router.delete(
  "/users/:id",
  AuthMiddleware,
  asyncHandler(controller.handleDeleteOne.bind(controller))
)

router.post(
  "/users",
  AuthMiddleware,
  asyncHandler(controller.handleCreate.bind(controller))
)

router.put(
  "/users/:id",
  AuthMiddleware,
  asyncHandler(controller.handleUpdate.bind(controller))
)

router.put(
  "/users/reset-password/:id",
  AuthMiddleware,
  asyncHandler(controller.handleResetPassword.bind(controller))
)

export = router
