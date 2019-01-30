'use strict';

const mongodb = require('./mongodb');
const { prisma } = require('./prisma');
const { initialize: initApolloServer, server: apolloServer } = require('./apollo');
const { create: createRedisClient, client: redisClient } = require('./redis');

module.exports = {
  mongodb,
  prisma,
  initApolloServer,
  apolloServer,
  redisClient,
  createRedisClient,
};
