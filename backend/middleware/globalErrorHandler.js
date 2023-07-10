const globalErrorHandler = (err, req, res, next) => {
  const messageError = err.message || 'Un known error!';
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: messageError,
    stack: err.stack,
  });
};

export default globalErrorHandler;
