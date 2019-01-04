'use strict';

const fs = require('fs');
const boom = require('boom');
const { Writable } = require('stream');

const baseRoute = '/api/crash';
const page = `Routes to test error handling:
  <ul>
    <li>Synchronous error</li>
    <ol>
      <li><a href="${baseRoute}/synchronous">A simple error thrown synchronously<a/></li>
    </ol>
  </ul>

  <ul>
    <li>Asynchronous error</li>
    <ol>
      <li><a href="${baseRoute}/async-read-file">Asynchronous error with readFile<a/></li>
      <li><a href="${baseRoute}/async-timeout">Asynchronous error with setTimeout wrapped with "try...catch"<a/></li>
      <li><a href="${baseRoute}/async-promise-catch">Asynchronous error with Promise. Errors handled by "catch()"<a/></li>
    </ol>
  </ul>

  <ul>
    <li>Unhandled promise rejection</li>
    <ol>
      <li><a href="${baseRoute}/rejected-promise-1">Example 1<a/></li>
      <li><a href="${baseRoute}/rejected-promise-2">Example 2<a/></li>
    </ol>
  </ul>

  <ul>
    <li>Correct error handling for Async Await</li>
    <ol>
      <li><a href="${baseRoute}/async-await-try-catch">Async Await error handling with try ..catch<a/></li>
      <li><a href="${baseRoute}/async-await">Async Await error handling wrapped in asyncMiddleware helper<a/></li>
    </ol>
  </ul>

  <ul>
    <li>Error handling with streams</li>
    <ol>
      <li><a href="${baseRoute}/stream-readable">Readable stream<a/></li>
      <li><a href="${baseRoute}/stream-writable">Writable stream<a/></li>
    </ol>
  </ul>

  <ul>
    <li>What happens if async error is not passed to "next()"?</li>
    <ol>
      <li><a href="${baseRoute}/async-no-next">An asynchronous error that was NOT passed to "next()"<a/></li>
    </ol>
  </ul>
`;

/**
 * A simple error thrown synchronously.
 * Express.js will catch this on its own.
 */
// eslint-disable-next-line no-unused-vars
module.exports.syncError = (req, res, next) => {
  throw new Error('Synchronous Error. Server will crash!');
};

/**
 * Asynchronous error with readFile.
 * Express.js will catch it only if it is passed to `next(err)`
 */
// eslint-disable-next-line no-unused-vars
module.exports.asyncReadFileError = (req, res, next) => {
  // eslint-disable-next-line consistent-return
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) return next(err); // Pass errors to Express.
    res.send(data);
  });
};

/**
 * Asynchronous error with setTimeout wrapped with `try...catch`.
 * Express.js will catch it only if it is passed to `next(err)`
 */
// eslint-disable-next-line no-unused-vars
module.exports.asyncTimeoutError = (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error(
        'Asynchronous Error thrown from setTimeout and handled with "try...catch" block. Server will crash!',
      );
    } catch (err) {
      next(err);
    }
  }, 100);
};

/**
 * Asynchronous error with Promise. Errors handled by `catch()`
 * Express.js will catch it only if it is passed to `next(err)`
 */
// eslint-disable-next-line no-unused-vars
module.exports.asyncPromiseCatchError = (req, res, next) => {
  Promise.resolve()
    .then(() => {
      throw new Error(
        'Asynchronous Error thrown from a success callback of a promise and handled by `catch()`!',
      );
    })
    .catch(next); // Errors will be passed to Express.
};

/**
 * Unhandled promise rejection. Example 1
 * Promise resolves only to call a success function where an error occurs due to
 * 'response' variable being not defined.
 * Using `catch()` would pass this error to Express.
 * The 'unhandledRejection' process event is used to track such cases.
 */
// eslint-disable-next-line no-unused-vars
module.exports.rejectedPromiseEg1Error = (req, res, next) => {
  Promise.resolve().then(() => {
    // eslint-disable-next-line
    res.send(`This is the response ${response}\n`); // `response` is not defined
  });
  // .catch(next); // Errors would be passed to Express if `catch()` was used
};

/**
 * Unhandled promise rejection. Example 2 - error in error callback of a rejected promise
 * The 'unhandledRejection' process event is used to track such cases.
 */
// eslint-disable-next-line no-unused-vars
module.exports.rejectedPromiseEg2Error = (req, res, next) => {
  Promise.reject(
    new Error(
      'Unhandled promise rejection error with an error in error callback of a rejected promise',
    ),
  ).then(
    () => {
      // 'will not get here'
    },
    // eslint-disable-next-line no-unused-vars
    err => {
      // eslint-disable-next-line
      next(error); // `error` is not defined
    },
  );
  // .catch(next); // Errors would be passed to Express if `catch()` or error callback was used.
};

/**
 * Asynchronous error that was NOT passed to `next()`
 * Express.js will not handler this error.
 * Instead, `uncaughtException` process event will catch it and by default crash the server.
 */
// eslint-disable-next-line no-unused-vars
module.exports.asyncNoNextError = (req, res, next) => {
  setTimeout(() => {
    throw new Error(
      "Asynchronous Error wasn't passed to `next() and is caught by uncaughtException`. Server will crash!",
    );
  }, 100);
};

const readFilePromise = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    // eslint-disable-next-line
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(boom.badImplementation(err));
      else res(data);
    });
  });

/**
 * Async Await error handling with try ..catch
 */
module.exports.asyncAwaitTryCatchError = async (req, res, next) => {
  try {
    const response = await readFilePromise('url-does-not-exists/data.json');
    res.json(response);
  } catch (err) {
    next(err); // Pass error to Express
  }
};

/**
 * Async Await error handling wrapped in asyncMiddleware helper
 * @link /server/utils/asyncMiddleware.js
 */
module.exports.asyncAwaitError = async (req, res) => {
  const response = await readFilePromise('url-does-not-exists/data.json');
  res.json(response);
};

/**
 * Readable stream
 */
module.exports.streamReadable = (req, res, next) => {
  const src = fs.createReadStream('url-does-not-exists/data.json');
  src.on('error', err => {
    next(err); // Pass error to express
  });
  src.pipe(res);
};

/**
 * Writable stream
 */
module.exports.streamWritable = (req, res, next) => {
  const writableStream = new Writable({
    // eslint-disable-next-line no-unused-vars
    write(chunk, encoding, callback) {
      this.emit('error', new Error('Error happened in a writable stream'));
    },
  });

  writableStream.on('error', err => {
    next(err); // Pass error to express
  });

  writableStream.write('Test');
};

// eslint-disable-next-line consistent-return, no-unused-vars
module.exports.index = (req, res, next) => res.status(200).send(page);
