'use strict';

const winston = require('../../src/utils/logger/winston');

describe('Winston logger', () => {
  test('should log errors to stderr when stderr.write() stream called', () => {
    const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
    winston.stream.stderr.write();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  test('should log errors to stdout when stdout.write stream called', () => {
    const info = jest.spyOn(winston, 'info').mockImplementation(value => value);
    winston.stream.stdout.write();
    expect(info).toHaveBeenCalled();
    info.mockRestore();
  });
});
