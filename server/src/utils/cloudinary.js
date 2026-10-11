const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const { Readable } = require("stream");
const path = require("path");
const config = require("../config/config");

// Configure Cloudinary instance
if (
  config.cloudinaryCloudName &&
  config.cloudinaryApiKey &&
  config.cloudinaryApiSecret
) {
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure: true,
  });
}

/**
 * Compress and optimize an image buffer using Sharp.
 * - Auto-rotates orientation using EXIF data
 * - Restricts max dimensions to 2048px (crisp 2K quality without unnecessary bloat)
 * - Converts to optimized WebP format with quality 82
 */
const optimizeImage = async (file) => {
  const isRasterImage =
    file.mimetype &&
    file.mimetype.startsWith("image/") &&
    !file.mimetype.includes("svg");

  if (!isRasterImage) {
    return {
      buffer: file.buffer,
      format: path.extname(file.originalname || "").replace(".", "") || "bin",
    };
  }

  try {
    const optimizedBuffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width: 2048,
        height: 2048,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return {
      buffer: optimizedBuffer,
      format: "webp",
    };
  } catch (error) {
    console.warn(
      "Sharp optimization warning, uploading original buffer:",
      error.message
    );
    return {
      buffer: file.buffer,
      format: path.extname(file.originalname || "").replace(".", "") || "jpg",
    };
  }
};

/**
 * Upload an in-memory buffer to Cloudinary using upload_stream.
 * Compresses and optimizes the image before uploading.
 */
const uploadToCloudinary = async (file, options = {}) => {
  if (
    !config.cloudinaryCloudName ||
    !config.cloudinaryApiKey ||
    !config.cloudinaryApiSecret
  ) {
    throw new Error(
      "Cloudinary configuration missing. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file."
    );
  }

  // Optimize image buffer before streaming to Cloudinary
  const { buffer, format } = await optimizeImage(file);

  const baseName = path
    .parse(file.originalname || "image")
    .name.replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const publicId = `${baseName}_${uniqueSuffix}`;

  const isPdf = file.mimetype === "application/pdf";
  const resourceType = isPdf ? "raw" : "image";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinaryFolder || "silkthread/uploads",
        public_id: publicId,
        resource_type: resourceType,
        format: format,
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,
  optimizeImage,
  uploadToCloudinary,
};
