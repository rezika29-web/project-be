"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbHelper = exports.DbHelper = void 0;
const sequelize_1 = require("sequelize");
const AllConfig_1 = __importDefault(require("../config/AllConfig"));
const AllModel_1 = __importDefault(require("../models/AllModel"));
class DbHelper {
    connectAndGetModels() {
        const { DB_NAME, DB_USERNAME, DB_PASSWORD, DBSIPINTAS_NAME, DBSIPINTAS_USERNAME, DBSIPINTAS_PASSWORD, DB_DIALECT, DB_HOST, DB_PORT, DB_POOL_MAX, DB_POOL_MIN, DB_POOL_ACQUIRE, DB_POOL_IDLE, } = AllConfig_1.default.envy;
        console.log("data db", {
            DB_NAME,
            DB_USERNAME,
            DB_PASSWORD,
            DBSIPINTAS_NAME,
            DBSIPINTAS_USERNAME,
            DBSIPINTAS_PASSWORD,
            DB_DIALECT,
            DB_HOST,
            DB_PORT,
            DB_POOL_MAX,
            DB_POOL_MIN,
            DB_POOL_ACQUIRE,
            DB_POOL_IDLE,
        });
        const sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
            dialect: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            pool: {
                max: DB_POOL_MAX,
                min: DB_POOL_MIN,
                acquire: DB_POOL_ACQUIRE,
                idle: DB_POOL_IDLE,
            },
        });
        const sequelizes = new sequelize_1.Sequelize(DBSIPINTAS_NAME, DBSIPINTAS_USERNAME, DBSIPINTAS_PASSWORD, {
            dialect: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            pool: {
                max: DB_POOL_MAX,
                min: DB_POOL_MIN,
                acquire: DB_POOL_ACQUIRE,
                idle: DB_POOL_IDLE,
            },
        });
        const allModel = new AllModel_1.default();
        const models = allModel.load(sequelize);
        return Object.assign({ sequelize }, models);
    }
}
exports.DbHelper = DbHelper;
exports.dbHelper = new DbHelper();
