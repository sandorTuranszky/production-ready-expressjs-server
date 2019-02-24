'use strict';

/**
 * Kue entry point
 */
const kue = require('kue');
const config = require('config');
const boom = require('boom');
const winston = require('../../../logger/winston');
const { saveJob, removeJobs } = require('./helpers');
const { email } = require('../../jobs');
const { defaults } = require('./config');

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

queue.watchStuckJobs(1000 * 10);

/**
 * Listeners
 */
queue.on('job enqueue', (id, type) => {
  winston.info(`Job #id ${id} got queued of type ${type}`);
});

queue.on('job complete', id => {
  removeJobs(id);
});

queue.on('error', err => {
  winston.error(`Error occurred during processing Kue jobs: ${boom.boomify(err)}`);
});

/**
 * Save email job
 * @param {*} data
 */
const send = data => {
  saveJob({ type: 'email', data });
};

/**
 * Process email jobs
 */
queue.process('email', defaults.concurrency, ({ data }, done) => {
  email
    .process(data)
    .then(result => email.handleResult(result, done))
    .catch(email.handleError);
});

module.exports = {
  queue,
  email: { send },
};
