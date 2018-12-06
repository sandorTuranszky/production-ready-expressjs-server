'use strict';

const config = require('config');

module.exports = app => {
  /**
   * Initiate crash routes to test how app handles errors (test env only)
   */
  /* istanbul ignore next line */
  if (app.get('env') !== 'production' && config.get('mock.crashAppRoutes'))
    app.use('/crash', require('../../tests/mock/crashAppRoutes')); // eslint-disable-line
};
