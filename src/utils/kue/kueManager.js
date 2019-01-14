'use strict';

// Move email functionality to a separate file
const kue = require('kue');
const config = require('config');
const winston = require('../logger/winston');

const queue = kue.createQueue({
  redis: config.get('db.redis.url'),
});

const defaults = {
  body: '',
  delay: 0,
  remove: true,
  priority: 'normal',
  attempts: 5,
  template: 'default-template',
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
  generic: 'type',
  email: ['title', 'to', 'body', 'template'],
};

const validateProps = args => {
  const [type, data] = args;
  const props = [...propsMap[type], ...propsMap.generic]; // eslint-disable-line security/detect-object-injection
  const keys = Object.keys(data);
  const errors = props.filter(prop => !keys[prop]); // eslint-disable-line security/detect-object-injection

  return errors.length > 0 ? errors : false;
};

const saveTask = args => {
  const [type, data, options] = args;
  const [delay, priority, attempts, remove] = { ...defaultOptions, ...options };

  const job = queue
    .create(type, data)
    .delay(delay)
    .priority(priority)
    .attempts(attempts)
    .removeOnComplete(remove)
    .save(err => {
      if (err) winston.error(`Error occurred during creating a Kue task: `, err);
      winston.info(`Kue task to send an email created: `, job);
    });

  return job;
};

const createTask = args => validateProps(args) || saveTask(args);

const sendEmail = data => createTask({ type: 'email', ...data });

const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
