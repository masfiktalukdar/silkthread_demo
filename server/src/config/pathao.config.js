require("dotenv").config();

const pathaoConfig = {
  baseUrl: (process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com").replace(/\/+$/, ""),
  clientId: process.env.PATHAO_CLIENT_ID || "",
  clientSecret: process.env.PATHAO_CLIENT_SECRET || "",
  username: process.env.PATHAO_USERNAME || "",
  password: process.env.PATHAO_PASSWORD || "",
  storeId: process.env.PATHAO_STORE_ID ? Number(process.env.PATHAO_STORE_ID) : null,
  webhookSecret: process.env.PATHAO_WEBHOOK_SECRET || "",
};

module.exports = pathaoConfig;
