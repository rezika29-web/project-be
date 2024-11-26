"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const SystemRouter_1 = __importDefault(require("./SystemRouter"));
const AuthRouter_1 = __importDefault(require("./AuthRouter"));
const RoleRouter_1 = __importDefault(require("./RoleRouter"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
const FileRouter_1 = __importDefault(require("./FileRouter"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const { APP_NAME, APP_VERSION } = process.env;
    res.json({
        APP_NAME,
        APP_VERSION,
    });
});
router.use(SystemRouter_1.default);
router.use(AuthRouter_1.default);
router.use(RoleRouter_1.default);
router.use(UserRouter_1.default);
router.use(FileRouter_1.default);
module.exports = router;
