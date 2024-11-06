import { Router } from "express"
import asyncHandler from "express-async-handler"
import AuthMiddleware from "../../middlewares/AuthMiddleware"
import FileController from "../../controllers/api/FileController"

const router = Router()
const controller = new FileController()

router.delete(
  "/files/:id",
  AuthMiddleware,
  asyncHandler(controller.handleDeleteOne.bind(controller))
)

router.post(
  "/files/:refTable",
  AuthMiddleware,
  asyncHandler(controller.handleCreate.bind(controller))
)

export = router
