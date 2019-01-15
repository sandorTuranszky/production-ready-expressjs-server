'use strict';

/**
 * Kue helpers
 */
const kue = require('kue');
const boom = require('boom');
const config = require('config');
const winston = require('../../../logger/winston');
const { defaultOptions } = require('./config');

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

/**
 * Save task
 * @param {*} args
 */
const saveTask = args => {
  const { type, data, options } = args;
  const { delay, priority, attempts, remove } = { ...defaultOptions(type), ...options };
  const job = queue
    .create(type, data)
    .delay(delay)
    .priority(priority)
    .attempts(attempts)
    .removeOnComplete(remove)
    .save(err => {
      if (err) winston.error(`Error occurred during creating a Kue task: ${boom.boomify(err)}`);
    });
  return job;
};

/**
 * Remove job when completed
 * @param {*} id
 */
const removeJobs = id => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    job.remove(error => {
      if (error) throw err;
      winston.info(`Removed completed job #d ${job.id}`);
    });
  });
};

module.exports = {
  saveTask,
  removeJobs,
};
