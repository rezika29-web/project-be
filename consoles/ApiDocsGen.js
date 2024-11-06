// import swaggerAutogen from "swagger-autogen"
const swaggerAutogen = require("swagger-autogen")
const dotenv = require("dotenv")

dotenv.config()

const { APP_NAME, HOST_PROTOCOL, HOST_DOMAIN, HOST_PORT } = process.env

const doc = {
  info: {
    title: APP_NAME,
    description: `${APP_NAME} API documentation.`,
  },
  host: `${HOST_DOMAIN}:${HOST_PORT}`,
  schemes: [HOST_PROTOCOL],
}

const outputFile = "./public/api-docs.json"
const endpointsFiles = ["./src/app.ts"]

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)

console.log(outputFile + " generated")
