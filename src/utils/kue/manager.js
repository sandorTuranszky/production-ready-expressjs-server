'use strict';

const winston = require('../logger/winston');
const email = require('./email');
const { queue, removeJobs } = require('./helpers');

queue.watchStuckJobs(1000 * 10);

queue.on('job enqueue', (id, type) => {
  winston.info(`Job #id ${id} got queued of type ${type}`);
});

queue.on('job complete', id => {
  removeJobs(id);
});

queue.on('error', err => {
  winston.error(`Error occurred during processing Kue jobs: ${err}`);
});

module.exports = {
  email,
};
