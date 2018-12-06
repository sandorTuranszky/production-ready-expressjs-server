'use strict';

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
