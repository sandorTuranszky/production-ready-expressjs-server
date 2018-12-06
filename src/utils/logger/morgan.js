'use strict';

const morgan = require('morgan');
const winston = require('./winston');

const stderrStream = (req, res, next) => {
  morgan('combined', {
    skip() {
      /* istanbul ignore next line */
      return res.statusCode < 400;
    },
    stream: winston.stream.stderr,
  });
  next();
};

const stdoutStream = (req, res, next) => {
  morgan('combined', {
    skip() {
      /* istanbul ignore next line */
      return res.statusCode >= 400;
    },
    stream: winston.stream.stdout,
  });
  next();
};

module.exports = {
  stderrStream,
  stdoutStream,
};
