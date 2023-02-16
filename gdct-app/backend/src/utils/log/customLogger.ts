//@ts-ignore
import morgan from 'morgan';
import chalk from 'chalk';
import logger from './winston';
import { Request, Response } from 'express';

morgan.token('status', (req: Request, res: Response) => {
  if (res.statusCode < 400) {
    return chalk.green(res.statusCode);
  }
  return chalk.red(res.statusCode);
});

// @ts-ignore
const customLogger = morgan(`:method :status :url - ${chalk.green(':response-time')} ms`, {
  stream: logger().stream,
});

export default customLogger;
