import { NextFunction, Request, Response } from "express";

export default class AppError extends Error {
  statusCode: number;
  isDetail: boolean;
  status: 'fail' | 'error';

  constructor(message: string, statusCode?: number) {
    super(message);
    //TODO issues with this, conflicting usage & types
    this.statusCode = statusCode || 400;
    this.isDetail = true; // get specific error for production
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export const wrapTryCatch = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  // where does statusCode come from
  console.log('HERE')
  fn(req, res, next).catch((err: any) => next(new AppError(err.message)));
};
