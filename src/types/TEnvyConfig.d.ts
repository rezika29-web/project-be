interface TEnvyConfig {
  APP_ENV: string
  APP_NAME: string
  APP_VERSION: string
  API_KEY: string
  ACCESS_KEY: string
  ACCESS_EXP: string
  HOST_PROTOCOL: string 
  HOST_DOMAIN: string
  HOST_PORT: number
  DB_DIALECT: Dialect | undefined
  DB_HOST: string
  DB_PORT: number
  DB_NAME: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_POOL_MAX: number
  DB_POOL_MIN: number
  DB_POOL_ACQUIRE: number
  DB_POOL_IDLE: number
  WEBAPP_URL: string
  MAILER_USER: string 
  MAILER_PASSWORD: string
  TELEGRAM_BOT_TOKEN: string 
  TELEGRAM_GROUP_CHAT_ID: string
}