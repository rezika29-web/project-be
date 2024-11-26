"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const UserController_1 = __importDefault(require("../../controllers/api/UserController"));
const router = (0, express_1.Router)();
const controller = new UserController_1.default();
router.get("/users/all", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadAll.bind(controller)));
router.get("/users", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadPaginate.bind(controller)));
router.get("/users/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadOne.bind(controller)));
router.delete("/users/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleDeleteOne.bind(controller)));
router.post("/users", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleCreate.bind(controller)));
router.put("/users/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleUpdate.bind(controller)));
router.put("/users/reset-password/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleResetPassword.bind(controller)));
module.exports = router;
