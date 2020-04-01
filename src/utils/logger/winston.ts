'use strict';

import config from 'config';
import appRoot from 'app-root-path';
import { createLogger, transports, format } from 'winston';

const { combine, prettyPrint } = format;

/**
 * Define the custom settings for each transport (file, console)
 */
const options = {
  ...(config.get('app.logging.file') && {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
  }),
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

/**
 * Instantiate a new Winston Logger with the settings defined above
 */
export const logger = createLogger({
  format: combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss',
    }),
    prettyPrint(),
  ),
  transports: [
    /* istanbul ignore next line */
    ...(config.get(app.logging.file) ? [new transports.File(options.file)] : []),
    new transports.Console(options.console),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

/**
 * Create a 'stdout/stderr' stream object with a 'write' function that will be used by `morgan`
 */

export const stream = {
  stdout: {
    // eslint-disable-next-line no-unused-vars
    write(message: any) {
      // Use the 'info' log level so the output will be picked up
      // By both transports (file and console)
      logger.info(message);
    },
  },
  stderr: {
    // eslint-disable-next-line no-unused-vars
    write(message: any) {
      // Use the 'error' log level so the output will be picked up
      // By both transports (file and console)
      logger.error(message);
    },
  },
};
