'use strict';

const kue = require('kue');
const config = require('config');
const { createTask } = require('./helpers');
const { defaults } = require('./config');

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

module.exports = {
  queue,
  defaults,
  createTask,
};
