import winston from 'winston';
import { SPLAT } from 'triple-beam';
import chalk from 'chalk';

const myFormat = winston.format.printf(({ level, message, label, ...others }) => {
  let formatedString = `${new Date().toLocaleString('en-CA')} [${label}] ${level}: ${message}`;
  if (others[SPLAT]) {
    formatedString += `${
      typeof others[SPLAT] === 'object' ? JSON.stringify(others[SPLAT]) : others[SPLAT]
    }`;
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
      json: false,
    }),
    new winston.transports.File({
      filename: 'log/gdct.log',
      level: 'info',
      format: winston.format.combine(myFormat),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
  ],
};

export let log;

export const initLogger = () => {
  log = winston.createLogger(options);
  log.stream = {
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
  } else {
    initLogger();
    return log;
  }
};

export default logger;
