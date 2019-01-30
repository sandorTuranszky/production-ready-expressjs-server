'use strict';

const { server: apolloServer, pubSub } = require('./apollo');

module.exports = {
  apolloServer,
  pubSub,
};
