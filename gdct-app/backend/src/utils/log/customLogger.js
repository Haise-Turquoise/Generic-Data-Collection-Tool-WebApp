import morgan from 'morgan';
import logger from './winston';
import chalk from 'chalk';

morgan.token('status', (req, res) => {
  if (res.statusCode < 400) {
    return chalk.green(res.statusCode);
  }
  return chalk.red(res.statusCode);
});

const customLogger = morgan(`:method :status :url - ${chalk.green(':response-time')} ms`, {
  stream: logger().stream,
});

export default customLogger;
