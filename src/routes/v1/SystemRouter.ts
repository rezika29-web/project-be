import { Router } from "express"
import asyncHandler from "express-async-handler"
import SystemController from "../../controllers/api/SystemController"

const router = Router()
const controller = new SystemController()

router.get("/system/envy", asyncHandler(controller.actionEnvy.bind(controller)))

export = router
