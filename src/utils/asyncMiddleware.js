'use strict';

const boom = require('boom');

/**
 * Wrapper for our async route handlers
 * @param {*} fn
 */
const asyncMiddleware = fn => (req, res, next) =>
  // eslint-disable-next-line consistent-return
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) return next(boom.badImplementation(err));
    next(err);
  });

module.exports = asyncMiddleware;
