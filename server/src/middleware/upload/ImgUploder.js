const { convertFileNameWithPdfExt } = require("./convertFileNameWithPdfExt");
const { convertFileNameWithWebpExt } = require("./convertFileNameWithWebpExt");
const { convertImgArrayToObject } = require("./convertImgArrayToObject");
const { uploadWorker } = require("./uploadWorker");
const { uploadToCloudinary } = require("../../utils/cloudinary");
const config = require("../../config/config");

const isCloudinaryConfigured = () =>
  Boolean(
    config.cloudinaryCloudName &&
      config.cloudinaryApiKey &&
      config.cloudinaryApiSecret
  );

const ImgUploader = async (files) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Invalid or empty files array");
  }

  const useCloudinary = isCloudinaryConfigured();

  const uploadPromises = files.map(async (file) => {
    const originalname =
      file.mimetype === "application/pdf"
        ? convertFileNameWithPdfExt(file.originalname)
        : convertFileNameWithWebpExt(file.originalname);

    const preparedFile = {
      buffer: file.buffer,
      originalname,
      fieldname: file.fieldname,
      mimetype: file.mimetype,
    };

    if (useCloudinary) {
      try {
        const uploadResult = await uploadToCloudinary(preparedFile);
        preparedFile.url = uploadResult.secure_url;
      } catch (err) {
        console.error(
          "Cloudinary upload failed, attempting local fallback:",
          err.message
        );
        await uploadWorker(preparedFile);
        preparedFile.url = `${config.uploadPath}${preparedFile.originalname}`;
      }
    } else {
      await uploadWorker(preparedFile);
      preparedFile.url = `${config.uploadPath}${preparedFile.originalname}`;
    }

    return preparedFile;
  });

  const processedFiles = await Promise.all(uploadPromises);
  const image = convertImgArrayToObject(processedFiles);
  return image;
};

module.exports = ImgUploader;