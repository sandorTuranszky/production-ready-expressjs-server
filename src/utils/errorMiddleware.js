'use strict';

const boom = require('boom');
const Sentry = require('@sentry/node');
const winston = require('./logger/winston');

/**
 * Wait for an error message to be logged by Sentry before exiting the process
 * @url https://docs.sentry.io/error-reporting/configuration/draining/?platform=node
 */
const exitProcess = () => {
  const sentryClient = Sentry.getCurrentHub().getClient();
  // eslint-disable-next-line promise/catch-or-return, promise/always-return, promise/no-promise-in-callback, no-process-exit
  if (sentryClient) sentryClient.close(2000).then(() => process.exit(1));
  else process.exit(1); // eslint-disable-line no-process-exit
};

/**
 * Catch 404 and forward to error handler
 */
const notFoundErrorHandler = (req, res, next) => {
  next(boom.notFound('Not Found'));
};

/**
 * The 'unhandledRejection' event is emitted whenever a Promise is rejected and
 * no error handler is attached to the promise.
 *
 * The 'unhandledRejection' event is useful for detecting and keeping track of promises
 * that were rejected whose rejections have not yet been handled.
 *
 * From Node.js v6.6.0: Unhandled Promise rejections emit a process warning. Process does not crash,
 * however in future versions of nodejs process will crash.
 *
 * @link https://nodejs.org/api/process.html#process_event_unhandledrejection
 */
const unhandledRejectionHandler = (reason, p) => {
  winston.error({ reason, message: 'Unhandled Rejection at Promise', p });
};

/**
 * The 'uncaughtException' event is emitted when an uncaught JavaScript exception
 * bubbles all the way back to the event loop omitting Express.js error handler.
 * Ideally, this should not be happening as all errors should be correctly handled by Express.js.
 * @link http://expressjs.com/en/guide/error-handling.html
 *
 * The default way of how Node.js handles such exceptions is PRESERVED!!! Namely,
 * 1. the stack trace is printed to stderr
 * 2. app exits with code 1
 * @link https://nodejs.org/api/process.html#process_event_uncaughtexception
 *
 * !!! WARNING !!!
 * It is not safe to resume normal operation after 'uncaughtException'.
 * @link https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
 */
const uncaughtExceptionHandler = err => {
  winston.error(err);
  exitProcess();
};

/**
 * Custom error handler middleware
 * Decorate error object with additional data
 * WARNING: Must be defined last, after other app.use() and routes calls
 */
const errorDecorator = (err, req, res, next) => {
  // Server error and stack trace is available - it is most likely a developer error
  const serverErrorWithStack = err.statusCode >= 500 && err.stack !== undefined;

  /**
   * The 'statusCode' is missing (for non Boom errors only) - it is most likely a developer error
   * Default error code is set to 'Internal Server Error (500)'. Server will crash!
   */
  const nonBoomNoStatusCode = !err.isBoom && !err.statusCode;

  // Use original error message or otherwise Boom will set a default one
  const originalMessage = err.message || null;

  const options = {
    // Add more details
    decorate: {
      // Assign existing `isDeveloperError` if available
      isDeveloperError: err.isDeveloperError || serverErrorWithStack || nonBoomNoStatusCode,
      originalUrl: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
    // Add stack trace if available
    data: { stack: err.stack || 'n/a' },
  };

  // Decorate with additional properties from Boom
  boom.boomify(err, options);

  // Use original error message or otherwise Boom will set a default one
  if (originalMessage) err.output.payload.message = originalMessage; // eslint-disable-line

  next(err);
};

/**
 * Custom error handling middleware - final
 * WARNING: Must be defined last, after other app.use(), routes calls
 * and all other error handling middleware
 */
// eslint-disable-next-line consistent-return
const finalErrorHandler = (err, req, res, next) => {
  /**
   * Delegate to the default Express error handler,
   * when the headers have already been sent to the client
   */
  if (res.headersSent) return next(err);

  // Log server errors only (no need to log 402, 403 etc.) and all developer/programmer errors
  if (err.isServer || err.isDeveloperError) winston.error(err);

  /**
   * Crash server in case of a developer error.
   * NOTE: a Node.js process manager should be set up to immediately restart the crashed server
   */
  if (err.isDeveloperError) exitProcess();
  else return res.status(err.output.statusCode).json(err);
};

module.exports = {
  exitProcess,
  errorDecorator,
  finalErrorHandler,
  notFoundErrorHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
};
