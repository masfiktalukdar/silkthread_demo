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

// If development, all api endpoints will be localhost. If production, production URL.
export const apiBaseUrl: string = isProduction
  ? process.env.NEXT_PUBLIC_API_BASE_URL &&
    !process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "https://api.silkthreadbd.com/api/v1"
  : "http://localhost:5001/api/v1";

export const FALLBACK_IMAGE_URL =
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg";

export const getImageUrl = (imagePath?: string | null): string => {
  if (
    !imagePath ||
    imagePath === "null" ||
    imagePath === "undefined" ||
    imagePath.trim() === "" ||
    imagePath.endsWith("/null") ||
    imagePath.endsWith("/undefined")
  ) {
    return FALLBACK_IMAGE_URL;
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${apiBaseUrl}${cleanPath}`;
};