const fs = require('fs/promises');
const path = require('path');
const config = require('../../config/config.js');
const { cloudinary } = require('../../utils/cloudinary');

exports.removeUploadFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;

  // If it's a Cloudinary URL, destroy it from Cloudinary
  if (fileUrl.includes("res.cloudinary.com")) {
    try {
      const parts = fileUrl.split("/upload/");
      if (parts.length > 1) {
        const pathAfterUpload = parts[1].replace(/^v\d+\//, "");
        const publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf("."));
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.warn("Cloudinary asset deletion skipped:", err.message);
    }
    return;
  }

  // Fallback to local disk file removal
  const fileName = path.basename(fileUrl);
  const removeFile = `${config.uploadFolder}${fileName}`;
  try {
    await fs.unlink(removeFile);
  } catch (err) {
  }
};
