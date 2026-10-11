const envVal = (
  process.env.ENVIRONMENT ||
  process.env.NEXT_PUBLIC_ENVIRONMENT ||
  process.env.environment ||
  process.env.NODE_ENV ||
  "development"
)
  .toLowerCase()
  .trim();

export const isProduction =
  envVal === "production" ||
  process.env.ENVIRONMENT === "production" ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

export const ENVIRONMENT = isProduction ? "production" : "development";

// If development, API endpoint is localhost. If production, production URL.
export const BASE_URL = isProduction
  ? process.env.NEXT_PUBLIC_API_BASE_URL &&
    !process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "https://api.silkthreadbd.com/api/v1"
  : "http://localhost:5001/api/v1";
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "Silk Thread";
export const STEADFAST_BASE_URL =
  process.env.NEXT_PUBLIC_STEADFAST_COURIER_API_BASE_URL ||
  "https://portal.steadfast.com.bd/api/v1";
export const STEADFAST_API_KEY =
  process.env.NEXT_PUBLIC_STEADFAST_COURIER_API_KEY || "";
export const STEADFAST_SECRET_KEY =
  process.env.NEXT_PUBLIC_STEADFAST_COURIER_SECRET_KEY || "";
