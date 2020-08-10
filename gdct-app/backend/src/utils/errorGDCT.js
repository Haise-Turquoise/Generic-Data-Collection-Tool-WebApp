export default class ErrorGDCT extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isWorking = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const exceptionHandler = () => {};
