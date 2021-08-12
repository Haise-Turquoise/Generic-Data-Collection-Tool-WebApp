import winston from 'winston';
//@ts-ignore
import { SPLAT } from 'triple-beam';
import chalk from 'chalk';

const myFormat = winston.format.printf(({ level, message, label, ...others }) => {
  let formatedString = `${new Date().toLocaleString('en-CA')} [${label}] ${level}: ${message}`;
  // @ts-ignore
  if (others[SPLAT]) {
    // @ts-ignore
    formatedString += `${typeof others[SPLAT] === 'object' ? JSON.stringify(others[SPLAT]) : others[SPLAT]}`;
  }

  return formatedString;
});

const options = {
  format: winston.format.combine(winston.format.label({ label: process.env.TITLE || 'Server' })),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(winston.format.colorize(), myFormat),
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: 'log/gdct.log',
      level: 'info',
      format: winston.format.combine(myFormat),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
};

export let log: winston.Logger;

export const initLogger = () => {
  log = winston.createLogger(options);
  log.stream = {
    // @ts-ignore
    write(message) {
      log.info(message.replace('\n', ''));
    },
  };
  console.clear();
  log.info(
    `'${chalk.cyan(process.env.TITLE)}' has started in ${chalk.cyan(
      process.env.NODE_ENV === 'production' ? process.env.NODE_ENV : 'development',
    )} mode!`,
  );
};

const logger = () => {
  if (log) {
    return log;
  }
  initLogger();
  return log;
};

export default logger;
