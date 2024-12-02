"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// @ts-ignore
const api_docs_json_1 = __importDefault(require("../public/api-docs.json"));
const AllConfig_1 = __importDefault(require("./config/AllConfig"));
const PrototypeHelper_1 = require("./helpers/PrototypeHelper");
const web_1 = __importDefault(require("./routes/web"));
const v1_1 = __importDefault(require("./routes/v1"));
const DbHelper_1 = require("./helpers/DbHelper");
// Prototypes setup
PrototypeHelper_1.prototypeHelper.applyAll();
// DB setup
const connAndModels = DbHelper_1.dbHelper.connectAndGetModels();
// Auto generate tables/fields disabled
// connAndModels.sequelize.sync()
globalThis.DB_PRIMARY = connAndModels;
// API setup
const { APP_NAME, APP_VERSION, HOST_PORT } = AllConfig_1.default.envy;
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://project-be-production-81c4.up.railway.app",
    "biroumumsumbar.com",
    "https://project-fe-production.up.railway.app",
    "http://localhost:4000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Header yang diizinkan
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({
    extended: true,
    // limit: "50mb",
    // parameterLimit: 1000000,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_docs_json_1.default, {
    customCss: `
    .swagger-ui #operations-tag-default { display: none }
    .swagger-ui #operations-default-get_ { display: none }
    .swagger-ui #operations-default-get_v1_ { display: none }
    `,
}));
app.set("view engine", "ejs");
app.get("/", web_1.default);
app.use("/v1", v1_1.default);
app.use("/v1", (err, req, res, next) => {
    // console.log(err)
    // @ts-ignore
    if (typeof err === "object" && err.isApiError) {
        // @ts-ignore
        res.status(err.num).json({ message: err.message });
    }
    else {
        next(err);
    }
});
app.listen(HOST_PORT, () => {
    console.log(`${APP_NAME} server is running at http://localhost:${HOST_PORT}`);
});
