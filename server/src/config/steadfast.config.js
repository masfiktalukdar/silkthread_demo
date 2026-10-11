require("dotenv").config();

const steadfastConfig = {
  baseUrl: (process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1").replace(/\/+$/, ""),
  apiKey: process.env.STEADFAST_API_KEY || "",
  secretKey: process.env.STEADFAST_SECRET_KEY || "",
  clientId: process.env.STEADFAST_CLIENT_ID || "",
  clientSecret: process.env.STEADFAST_CLIENT_SECRET || "",
  webhookSecret: process.env.STEADFAST_WEBHOOK_SECRET || "",
};

module.exports = steadfastConfig;
