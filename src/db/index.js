'use strict';

const mongodb = require('./mongodb');
const { prisma } = require('./prisma');
const { create: createRedisClient, client: redisClient } = require('./redis');

module.exports = {
  mongodb,
  prisma,
  redisClient,
  createRedisClient,
};
