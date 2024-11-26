"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const AuthController_1 = __importDefault(require("../../controllers/api/AuthController"));
const router = (0, express_1.Router)();
const controller = new AuthController_1.default();
router.post("/auth/login", (0, express_async_handler_1.default)(controller.handleLogin.bind(controller)));
router.get("/auth/logout", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleLogout.bind(controller)));
router.get("/auth/my-account", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleMyAccount.bind(controller)));
router.get("/auth/get/my-account", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleGetMyAccount.bind(controller)));
router.put("/auth/my-account", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleUpdateMyAccount.bind(controller)));
router.put("/auth/my-account/update-password", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleUpdatePassword.bind(controller)));
module.exports = router;
