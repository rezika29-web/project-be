"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const FileController_1 = __importDefault(require("../../controllers/api/FileController"));
const router = (0, express_1.Router)();
const controller = new FileController_1.default();
router.delete("/files/:id", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleDeleteOne.bind(controller)));
router.post("/files/:refTable", AuthMiddleware_1.default, (0, express_async_handler_1.default)(controller.handleCreate.bind(controller)));
module.exports = router;
