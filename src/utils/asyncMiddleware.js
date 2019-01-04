'use strict';

/* eslint-disable consistent-return, promise/no-callback-in-promise */

const boom = require('boom');

/**
 * Wrapper for our async route handlers
 * @param {*} fn
 */
const asyncMiddleware = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) return next(boom.badImplementation(err));
    next(err);
  });

module.exports = asyncMiddleware;
