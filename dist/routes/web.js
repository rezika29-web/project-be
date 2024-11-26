"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HomeController_1 = __importDefault(require("../controllers/web/HomeController"));
const router = (0, express_1.Router)();
const controller = new HomeController_1.default();
router.get("/", (0, express_async_handler_1.default)(controller.handleIndex.bind(controller)));
module.exports = router;
