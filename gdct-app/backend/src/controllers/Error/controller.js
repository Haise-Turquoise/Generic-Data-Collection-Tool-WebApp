import CONSTANTS from '../../configs/constants';
import errorHandler from '../../configs/errorHandler';
import { log } from '../../utils/log/winston';

const errorHandlerController = (err, req, res, next) => {
  if (err) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const isProduction = process.env.NODE_ENV === 'production';
    err.isDetail = true; // manual setting for now
    if (isProduction) {
      if (err.isDetail) {
        if (err.name === CONSTANTS.CAST_ERROR) err = errorHandler.handleCastErrorDB(err);
        if (err.code === CONSTANTS.DUPLICATE_FIELD_ERROR)
          err = errorHandler.handleDuplicateFieldsDB(err);
        if (err.name === CONSTANTS.VALIDATION_ERROR)
          err = errorHandler.handleValidationErrorDB(err);
        if (err.name === CONSTANTS.JSON_TOKEN_ERROR) err = errorHandler.handleJWTError();
        if (err.name === CONSTANTS.TOKEN_EXPIRED_ERROR) err = errorHandler.handleJWTExpiredError();
      } else {
        err.message = 'Please contact server admin';
      }
    }
    const stack = isProduction ? null : err.stack;
    log.error(`[${err.statusCode}][${req.method}-${req.originalUrl}] - ${err.message}`);
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

export default errorHandlerController;
