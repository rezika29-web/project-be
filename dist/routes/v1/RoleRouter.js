"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const RoleController_1 = __importDefault(require("../../controllers/api/RoleController"));
const router = (0, express_1.Router)();
const controller = new RoleController_1.default();
router.get("/roles/all", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadAll.bind(controller)));
router.get("/roles", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadPaginate.bind(controller)));
router.get("/roles/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleReadOne.bind(controller)));
router.delete("/roles/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleDeleteOne.bind(controller)));
router.post("/roles", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleCreate.bind(controller)));
router.put("/roles/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleUpdate.bind(controller)));
module.exports = router;
