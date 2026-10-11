require("dotenv/config");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const rawEnv = (
  process.env.ENVIRONMENT ||
  process.env.environment ||
  process.env.NODE_ENV ||
  "development"
)
  .toLowerCase()
  .trim();

const isProduction = rawEnv === "production";
const environment = isProduction ? "production" : "development";

const {
  PORT,
  HOST,
  MONGO_CONNECTION_STRING,
  MONGO_PASSWORD,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  UPLOAD_FOLDER,
  UPLOAD_PATH,
  SERVER_URL,
  CLIENT_BASE_URL,
} = process.env;

const port = PORT || 5001;

// When development, all endpoints will be localhost.
// When production, endpoints will be the production URLs.
const serverURL = isProduction
  ? (SERVER_URL && !SERVER_URL.includes("localhost") ? SERVER_URL : "https://api.silkthreadbd.com/api/v1")
  : `http://localhost:${port}/api/v1`;

const clientBaseURL = isProduction
  ? (CLIENT_BASE_URL && !CLIENT_BASE_URL.includes("localhost") ? CLIENT_BASE_URL : "https://silkthreadbd.com")
  : "http://localhost:3000";

const config = {
  environment,
  isProduction,
  port,
  host: HOST || "localhost",
  serverURL,
  clientBaseURL,
  databaseUrl: MONGO_CONNECTION_STRING || "mongodb://localhost:27017/silkthread",
  databasePassword: MONGO_PASSWORD || "",
  jwtAccessSecretKey: JWT_ACCESS_SECRET_KEY || "default_jwt_access_secret_key",
  jwtRefreshSecretKey: JWT_REFRESH_SECRET_KEY || "default_jwt_refresh_secret_key",
  uploadFolder: UPLOAD_FOLDER || "uploads/",
  uploadPath: UPLOAD_PATH || "/uploads",
  smtpService: "gmail",
  smtpUser: process.env.EMAIL_USERNAME || "",
  smtpPass: process.env.EMAIL_PASSWORD || "",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
  smsUrl: process.env.SMS_URL || "",
  smsKey: process.env.SMS_KEY || "",
  smsSenderId: process.env.SMS_SENDER_ID || "",
  cloudinaryCloudName:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "silkthread/uploads",
  pathao: require("./pathao.config.js"),
  steadfast: require("./steadfast.config.js"),
};

module.exports = config;
