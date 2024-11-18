import dotenv from 'dotenv'

export default function EnvyConfig():TEnvyConfig {
  dotenv.config()
  
  return {
    APP_ENV: String(process.env.APP_ENV),
    APP_NAME: String(process.env.APP_NAME),
    APP_VERSION: String(process.env.APP_VERSION),
    API_KEY: String(process.env.API_KEY),
    ACCESS_KEY: String(process.env.ACCESS_KEY),
    ACCESS_EXP: String(process.env.ACCESS_EXP),
    HOST_PROTOCOL: String(process.env.HOST_PROTOCOL),
    HOST_DOMAIN: String(process.env.HOST_DOMAIN),
    HOST_PORT: Number(process.env.HOST_PORT),
    DB_DIALECT: String(process.env.DB_DIALECT),
    DB_HOST: String(process.env.DB_HOST),
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: String(process.env.DB_NAME),
    DB_USERNAME: String(process.env.DB_USERNAME),
    DB_PASSWORD: String(process.env.DB_PASSWORD),
    DBSIPINTAS_NAME: String(process.env.DBSIPINTAS_NAME),
    DBSIPINTAS_USERNAME: String(process.env.DBSIPINTAS_USERNAME),
    DBSIPINTAS_PASSWORD: String(process.env.DBSIPINTAS_PASSWORD),
    DB_POOL_MAX: Number(process.env.DB_POOL_MAX),
    DB_POOL_MIN: Number(process.env.DB_POOL_MIN),
    DB_POOL_ACQUIRE: Number(process.env.DB_POOL_ACQUIRE),
    DB_POOL_IDLE: Number(process.env.DB_POOL_IDLE),
    WEBAPP_URL: String(process.env.WEBAPP_URL),
    MAILER_USER: String(process.env.MAILER_USER),
    MAILER_PASSWORD: String(process.env.MAILER_PASSWORD),
    TELEGRAM_BOT_TOKEN: String(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_GROUP_CHAT_ID: String(process.env.TELEGRAM_GROUP_CHAT_ID),
  }
}