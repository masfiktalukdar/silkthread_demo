const { uploadToCloudinary } = require('../../utils/cloudinary');
const fs = require('fs');
const config = require('../../config/config.js');

exports.uploadSinglePdf = async (file) => {
  if (
    config.cloudinaryCloudName &&
    config.cloudinaryApiKey &&
    config.cloudinaryApiSecret
  ) {
    try {
      const result = await uploadToCloudinary(file);
      file.url = result.secure_url;
      return { success: true, url: result.secure_url };
    } catch (err) {
      console.error(
        "Cloudinary single PDF upload error, using local fallback:",
        err.message
      );
    }
  }

  fs.access(config.uploadFolder, (error) => {
    if (error) {
      fs.mkdirSync(config.uploadFolder, { recursive: true });
    }
  });
  const { buffer, originalname } = file;
  const filePath = `${config.uploadFolder}${originalname}`;
  try {
    fs.writeFileSync(filePath, buffer);
    file.url = `${config.uploadPath}${originalname}`;
    return { success: true };
  } catch (err) {
    return err;
  }
};
