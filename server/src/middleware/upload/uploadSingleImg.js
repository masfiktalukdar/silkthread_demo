const { uploadToCloudinary } = require('../../utils/cloudinary');
const fs = require('fs');
const config = require('../../config/config.js');

exports.uploadSingleImg = async (file) => {
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
        "Cloudinary single image upload error, using local fallback:",
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

  try {
    fs.writeFileSync(`${config.uploadFolder}${originalname}`, buffer);
    file.url = `${config.uploadPath}${originalname}`;
    return { success: true };
  } catch (err) {
    return err;
  }
};



