"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AllConfig_1 = __importDefault(require("../config/AllConfig"));
const { APP_NAME, APP_VERSION } = AllConfig_1.default.envy;
class CoreController {
    constructor() {
        this.defaultMetadata = {
            app: {
                name: APP_NAME,
                version: APP_VERSION,
            },
            title: APP_NAME,
        };
        this.metadata = this.defaultMetadata;
    }
}
exports.default = CoreController;
