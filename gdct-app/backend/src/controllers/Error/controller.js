import { log } from '../../utils/log/winston';

const errorHandlerController = (err, req, res, next) => {
  if (err) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const stack = process.env.NODE_ENV === 'production' ? {} : err.stack;
    log.error(`[${err.statusCode}] - ${err.message} from [${req.method} - ${req.orginalUrl}]`);
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
