import { Router } from "express"
import asyncHandler from "express-async-handler"
import AuthMiddleware from "../../middlewares/AuthMiddleware"
import RoleController from "../../controllers/api/RoleController"

const router = Router()
const controller = new RoleController()

router.get(
  "/roles/all",
  AuthMiddleware,
  asyncHandler(controller.handleReadAll.bind(controller))
)

router.get(
  "/roles",
  AuthMiddleware,
  asyncHandler(controller.handleReadPaginate.bind(controller))
)

router.get(
  "/roles/:id",
  AuthMiddleware,
  asyncHandler(controller.handleReadOne.bind(controller))
)

router.delete(
  "/roles/:id",
  AuthMiddleware,
  asyncHandler(controller.handleDeleteOne.bind(controller))
)

router.post(
  "/roles",
  AuthMiddleware,
  asyncHandler(controller.handleCreate.bind(controller))
)

router.put(
  "/roles/:id",
  AuthMiddleware,
  asyncHandler(controller.handleUpdate.bind(controller))
)

export = router
