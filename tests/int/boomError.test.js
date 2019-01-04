'use strict';

/* eslint-disable promise/catch-or-return, promise/always-return, promise/no-callback-in-promise */

const request = require('supertest')(require('../../src/app'));

const pageNotFoundRoute = '/route-does-not-exists';

describe(`GET ${pageNotFoundRoute}`, () => {
  it('respond with an error decorated with Boom', done => {
    request.get(pageNotFoundRoute).then(res => {
      expect(res.body.isBoom).toBe(true);
      done();
    });
  });
});
