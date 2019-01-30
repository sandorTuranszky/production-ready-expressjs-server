'use strict';

const mongodb = require('./mongodb');
const { prisma } = require('./prisma');
const { server: apolloServer, pubSub } = require('./apollo');
const { create: createRedisClient, client: redisClient } = require('./redis');

module.exports = {
  mongodb,
  prisma,
  apolloServer,
  pubSub,
  redisClient,
  createRedisClient,
};
