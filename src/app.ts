import express, { Express, Request, Response, NextFunction } from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import asyncHandler from "express-async-handler"
import swaggerUi from "swagger-ui-express"
// @ts-ignore
import swaggerDocument from "../public/api-docs.json"
import config from "./config/AllConfig"
import { prototypeHelper } from "./helpers/PrototypeHelper"
import webRoutes from "./routes/web"
import v1Routes from "./routes/v1"
import { dbHelper } from "./helpers/DbHelper"

// Prototypes setup

prototypeHelper.applyAll()

// DB setup

const connAndModels = dbHelper.connectAndGetModels()
// Auto generate tables/fields disabled
// connAndModels.sequelize.sync()

globalThis.DB_PRIMARY = connAndModels

// API setup

const { APP_NAME, APP_VERSION, HOST_PORT } = config.envy
const app: Express = express()

app.use(cors(
  {
    origin: ["*"], // Tambahkan domain frontend
    // credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metode HTTP yang diizinkan
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Header yang diizinkan
  }
))
app.use(helmet())

app.use(
  express.urlencoded({
    extended: true,
    // limit: "50mb",
    // parameterLimit: 1000000,
  })
)
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())

app.use(express.static("public"))
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: `
    .swagger-ui #operations-tag-default { display: none }
    .swagger-ui #operations-default-get_ { display: none }
    .swagger-ui #operations-default-get_v1_ { display: none }
    `,
  })
)

app.set("view engine", "ejs")

app.get("/", webRoutes)

app.use("/v1", v1Routes)
app.use(
  "/v1",
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // console.log(err)
    // @ts-ignore
    if (typeof err === "object" && err.isApiError) {
      // @ts-ignore
      res.status(err.num).json({ message: err.message })
    } else {
      next(err)
    }
  }
)

app.listen(HOST_PORT, () => {
  console.log(`${APP_NAME} server is running at http://localhost:${HOST_PORT}`)
})
