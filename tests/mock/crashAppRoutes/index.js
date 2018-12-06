'use strict';

const express = require('express');
const controller = require('./crash.controller');
const asyncMiddleware = require('../../../src/utils/asyncMiddleware');

const router = express.Router();

// Synchronous error
router.get('/synchronous', controller.syncError);

// Asynchronous error
router.get('/async-read-file', controller.asyncReadFileError);
router.get('/async-timeout', controller.asyncTimeoutError);
router.get('/async-promise-catch', controller.asyncPromiseCatchError);

// Unhandled promise rejection
router.get('/rejected-promise-1', controller.rejectedPromiseEg1Error); // Example 1
router.get('/rejected-promise-2', controller.rejectedPromiseEg2Error); // Example 2

// Correct error handling for Async Await
router.get('/async-await-try-catch', controller.asyncAwaitTryCatchError); // With try...catch
router.get('/async-await', asyncMiddleware(controller.asyncAwaitError)); // With asyncMiddleware

// Streams
router.get('/stream-readable', controller.streamReadable);
router.get('/stream-writable', controller.streamWritable);

// What happens if async error is not passed to `next()`?
router.get('/async-no-next', controller.asyncNoNextError);

/**
 * List of available routes
 */
router.get('/:type*?', controller.index);

module.exports = router;
