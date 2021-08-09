import { Response } from "express";
import { Error } from "mongoose";

export const returnNormalJson = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'ok',
    data,
    error: null,
  });
};

export const returnErrorJson = (res: Response, error: string, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    data: null,
    error,
  });
};
