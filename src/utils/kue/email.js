'use strict';

// Const winston = require('../logger/winston');
const { createTask } = require('./helpers');
const { defaults } = require('./config');
const { queue } = require('./helpers');
const { send } = require('./integrations/mailjet');

const presetTemplates = {
  welcome: 'welcome-template',
};

const sendEmail = data => createTask({ type: 'email', ...data });

const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

// Const process = (job, done) => {
//   Winston.info(`Send email to ${job.data.email}`);
//   Send(job.data);
//   Done();
// };

// eslint-disable-next-line no-unused-vars
queue.process('email', defaults.email.concurrency, (job, done) => {
  send(job.data);
  done();
});

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
