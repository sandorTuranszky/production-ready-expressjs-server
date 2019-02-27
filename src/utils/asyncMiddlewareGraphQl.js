'use strict';

/* eslint-disable consistent-return, promise/no-callback-in-promise */

const boom = require('boom');

/**
 * Wrapper for our async route handlers
 * @param {*} fn
 */
const asyncMiddlewareGraphQl = resolver => (...args) =>
  Promise.resolve(resolver(...args)).catch(err => {
    if (!err.isBoom) throw boom.badImplementation(err);
    throw err;
  });

module.exports = asyncMiddlewareGraphQl;
