import { Router } from "express"
import asyncHandler from "express-async-handler"
import HomeController from "../controllers/web/HomeController"

const router = Router()
const controller = new HomeController()

router.get("/", asyncHandler(controller.handleIndex.bind(controller)))

export = router
