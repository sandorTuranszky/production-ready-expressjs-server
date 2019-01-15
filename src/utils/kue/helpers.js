'use strict';

const kue = require('kue');
const boom = require('boom');
const config = require('config');
const winston = require('../logger/winston');
const { defaultOptions } = require('./config');

const propsMap = {
  generic: ['type'],
  email: ['subject', 'to', 'body', 'template'],
};

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

const validateProps = args => {
  const { type, data } = args;
  const props = propsMap[type] || []; // eslint-disable-line security/detect-object-injection
  const keys = Object.keys(data);
  const errors = props.filter(prop => keys.indexOf(prop) === -1);
  return errors.length > 0 ? errors : false;
};

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

const createTask = args => validateProps(args) || saveTask(args);

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
  queue,
  createTask,
  removeJobs,
};
