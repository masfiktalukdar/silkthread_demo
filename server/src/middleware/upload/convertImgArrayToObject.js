const config = require('../../config/config.js');

exports.convertImgArrayToObject = (files) => {
  return files.reduce((total, file) => {
    const fileUrl = file.url || `${config.uploadPath}${file.originalname}`;
    if (total[file.fieldname]) {
      if (Array.isArray(total[file.fieldname])) {
        total[file.fieldname].push(fileUrl);
      } else {
        total[file.fieldname] = [
          total[file.fieldname],
          fileUrl,
        ];
      }
    } else {
      total[file.fieldname] = fileUrl;
    }
    return total;
  }, {});
};
