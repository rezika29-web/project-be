"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AllConfig_1 = __importDefault(require("../../config/AllConfig"));
const ApiController_1 = __importDefault(require("../../core/ApiController"));
class SystemController extends ApiController_1.default {
    actionEnvy(req, res) {
        /* #swagger.tags = ['System'] */
        for (const key of Object.keys(AllConfig_1.default.envy)) {
            // @ts-ignore
            this.warning(`${key}: ${AllConfig_1.default.envy[key]}`);
        }
        res.json(AllConfig_1.default.envy);
    }
}
exports.default = SystemController;
