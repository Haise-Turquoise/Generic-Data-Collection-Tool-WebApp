export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isDetail = true; // get specific error for production
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export const wrapTryCatch = fn => (req, res, next) => {
  fn(req, res, next).catch(err => next(new AppError(err)));
};
