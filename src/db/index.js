'use strict';

const mongodb = require('./mongodb');
const { create: createRedisClient, client: redisClient } = require('./redis');

module.exports = {
  mongodb,
  redisClient,
  createRedisClient,
};
