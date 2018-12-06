'use strict';

const boom = require('boom');
const winston = require('../../src/utils/logger/winston');

const {
  notFoundErrorHandler,
  errorDecorator,
  finalErrorHandler,
} = require('../../src/utils/errorMiddleware.js');

describe('Error handlers from errorMiddleware', () => {
  describe('Function notFoundErrorHandler', () => {
    const next = jest.fn();
    beforeAll(() => {
      notFoundErrorHandler(null, null, next);
    });
    test('should call next() with Boom error object as an argument', () => {
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0].isBoom).toBe(true);
    });

    test('should not have "isDeveloperError" property defined as Boom error object property', () => {
      expect(next.mock.calls[0][0].isDeveloperError).toBeUndefined();
    });

    test('should have 404 set for Boom error object "statusCode" property', () => {
      expect(next.mock.calls[0][0].output.statusCode).toBe(404);
    });

    test('should have "Not Found" error message set for Boom error object "message" properties', () => {
      expect(next.mock.calls[0][0].output.payload.message).toBe('Not Found');
    });

    test('should have a false value set for Boom error object "isServer" properties', () => {
      expect(next.mock.calls[0][0].isServer).toBe(false);
    });
  });

  describe('Function errorDecorator', () => {
    const req = {
      originalUrl: 'https://www.test.com',
      method: 'GET',
      ip: '127.0.0.1',
    };

    describe('Value for "err.isDeveloperError" property', () => {
      const res = { headersSent: false };
      describe('If already defined on Boom error object', () => {
        const err = boom.badImplementation('Terrible implementation');
        const next = jest.fn(() => err);

        test('should not change if "err.isDeveloperError" set to "true"', () => {
          errorDecorator(err, req, res, next);
          expect(err.isDeveloperError).toBe(true);
        });

        test('should not change if "err.isDeveloperError" set to "false" manually', () => {
          err.isDeveloperError = false;
          errorDecorator(err, req, res, next);
          expect(err.isDeveloperError).toBe(false);
        });
      });
    });

    describe('When decorating', () => {
      const err = new Error('Some error');
      const res = { headersSent: false };
      const next = jest.fn(() => err);
      errorDecorator(err, req, res, next);

      test('should boomify error object', () => {
        expect(err.isBoom).toBe(true);
      });

      describe('And "err.stack" is available', () => {
        test('should have "data.stack" defined', () => {
          expect(err.data.stack).toBeDefined();
        });
      });

      test('should use passed in error message (if available) in boomified error object', () => {
        expect(err.output.payload.message).toBe(err.message);
      });

      describe('And "err.message" is not available', () => {
        const errWithNoMessage = new Error();
        errorDecorator(errWithNoMessage, req, res, next);
        test('should use default error message from boom error object', () => {
          // boom will set a default error code 500 with message 'An internal server error occurred'
          expect(errWithNoMessage.output.payload.message).toBe('An internal server error occurred');
        });
      });

      describe('And "err.stack" is not available', () => {
        const errWithNoStack = new Error('Some error');
        delete errWithNoStack.stack;
        errorDecorator(errWithNoStack, req, res, next);
        test('should have "data.stack" defined with value "n/a"', () => {
          expect(errWithNoStack.data.stack).toBe('n/a');
        });
      });
    });
  });

  describe('Function finalErrorHandler', () => {
    describe('When "headersSent" is "false"', () => {
      const err = boom.badRequest('Bad request');
      const res = {
        headersSent: false,
        json() {},
        status() {
          return this;
        },
      };

      test('should not return with function "next()" with error object.', () => {
        const next = jest.fn(() => err);
        expect(finalErrorHandler(err, {}, res, next)).toBeUndefined();
      });
    });

    describe('When it is a server error and not a developer error', () => {
      test('should call "winston.error" with "err" as an argument', () => {
        const err = boom.badImplementation('Terrible implementation');
        const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
        const res = {
          json() {},
          status() {
            return this;
          },
        };
        err.isDeveloperError = false;
        finalErrorHandler(err, {}, res, {});
        expect(error).toHaveBeenCalledWith(err);
        error.mockRestore();
      });
    });

    describe('When it is not a developer error - server does not crash', () => {
      test('should return status code', () => {
        const err = boom.badRequest('Bad request');
        const res = {
          json() {},
          status(statusCode) {
            expect(err.output.statusCode).toBe(statusCode);
            return this;
          },
        };
        finalErrorHandler(err, {}, res, {});
      });

      test('should return error object', () => {
        const err = boom.badRequest('Bad request');
        const res = {
          json(data) {
            expect(err).toBe(data);
          },
          status() {
            return this;
          },
        };
        finalErrorHandler(err, {}, res, {});
      });
    });
  });
});
