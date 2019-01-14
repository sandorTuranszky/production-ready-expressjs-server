'use strict';

const kue = require('kue');
const config = require('config');
const winston = require('../logger/winston');

const defaults = {
  body: '',
  delay: 0,
  remove: false,
  priority: 'normal',
  attempts: 5,
  template: 'default-template',
  concurrency: 10,
};

const defaultOptions = {
  delay: defaults.delay,
  priority: defaults.priority,
  attempts: defaults.attempts,
  remove: defaults.remove,
};

const presetTemplates = {
  welcome: 'welcome-template',
};

const propsMap = {
  generic: ['type'],
  email: ['title', 'to', 'body', 'template'],
};

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

queue.watchStuckJobs(1000 * 10);

queue.on('job enqueue', (id, type) => {
  winston.info('Job %s got queued of type %s', id, type);
});

// eslint-disable-next-line no-unused-vars
queue.on('job complete', id => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    job.remove(error => {
      if (error) throw err;
      winston.info('Removed completed job #%d', job.id);
    });
  });
});

queue.on('error', err => {
  winston.error(`Error occurred during processing Kue jobs: `, err);
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
  const { delay, priority, attempts, remove } = { ...defaultOptions, ...options };

  const job = queue
    .create(type, data)
    .delay(delay)
    .priority(priority)
    .attempts(attempts)
    .removeOnComplete(remove)
    .save(err => {
      if (err) winston.error(`Error occurred during creating a Kue task: `, err);
    });

  return job;
};

const send = (job, done) => {
  winston.info('Send email to %s', job.data.to);
  done();
};

const createTask = args => validateProps(args) || saveTask(args);

const sendEmail = data => createTask({ type: 'email', ...data });

const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

// eslint-disable-next-line no-unused-vars
queue.process('email', defaults.concurrency, (job, done) => {
  send(job, done);
});

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
