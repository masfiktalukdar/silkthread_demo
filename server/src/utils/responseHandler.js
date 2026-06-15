const responseHandler = (statusCode, message, data, url) => {
  return {
    statusCode,
    status: 'success',
    message,
    ...(data && { data }),
    url
  };
};

module.exports = responseHandler;
