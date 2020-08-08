export const errorHandlerController = (err, req, res, next) => {
  if (err) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const stack = process.env.NODE_ENV === 'production' ? {} : err.stack;
    res.status(err.statusCode).json({
      status: err.status,
      data: {},
      errors: {
        message: err.message,
        stack,
      },
    });
  } else {
    next();
  }
};
