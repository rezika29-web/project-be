"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AllConfig_1 = __importDefault(require("../config/AllConfig"));
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const { ACCESS_KEY } = AllConfig_1.default.envy;
function AuthMiddleware(req, res, next) {
    const { accessToken } = req.cookies;
    const { authorization } = req.headers;
    let token;
    if (accessToken) {
        token = accessToken;
    }
    else if (authorization) {
        if (authorization.substr(0, 6) !== "Bearer") {
            throw (0, ErrorHelper_1.accessDenied)();
        }
        token = authorization.replace("Bearer ", "");
    }
    let userActive;
    try {
        userActive = jsonwebtoken_1.default.verify(token, ACCESS_KEY);
    }
    catch (err) {
        console.log(err);
        throw (0, ErrorHelper_1.accessDenied)();
    }
    res.locals.userActive = userActive;
    next();
}
exports.default = AuthMiddleware;
