'use strict';

const winston = require('../logger/winston');
const { createTask } = require('./helpers');
const { defaults } = require('./config');
const { queue } = require('./helpers');

const presetTemplates = {
  welcome: 'welcome-template',
};

const sendEmail = data => createTask({ type: 'email', ...data });

const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

const send = (job, done) => {
  winston.info(`Send email to ${job.data.email}`);
  done();
};

// eslint-disable-next-line no-unused-vars
queue.process('email', defaults.email.concurrency, (job, done) => {
  send(job, done);
});

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
