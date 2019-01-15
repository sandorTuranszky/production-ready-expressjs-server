'use strict';

/**
 * Kue entry point
 */
const kue = require('kue');
const config = require('config');
const boom = require('boom');
const winston = require('../../../logger/winston');
const { saveTask, removeJobs } = require('./helpers');
const { defaults } = require('./config');

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

queue.watchStuckJobs(1000 * 10);

queue.on('job enqueue', (id, type) => {
  winston.info(`Job #id ${id} got queued of type ${type}`);
});

queue.on('job complete', id => {
  removeJobs(id);
});

queue.on('error', err => {
  winston.error(`Error occurred during processing Kue jobs: ${boom.boomify(err)}`);
});

module.exports = {
  queue,
  defaults,
  saveTask,
};
