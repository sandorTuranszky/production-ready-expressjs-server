'use strict';

const boom = require('boom');
const winston = require('../../logger/winston');
const { queue, defaults, createTask } = require('../queues/kue');
const { send } = require('../integrations/mailjet');

const presetTemplates = {
  welcome: 'welcome-template',
};

const sendEmail = data => createTask({ type: 'email', ...data });

const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

const handleResult = (result, done) => {
  winston.info(`Email sent: ${JSON.stringify(result)}`);
  done();
};

const handleError = err => {
  winston.error(`Error occurred during sending email: ${boom.boomify(err)}`);
};

/**
 * Kue specific implementation of email sending functionality
 */
// eslint-disable-next-line no-unused-vars
queue.process('email', defaults.email.concurrency, (job, done) => {
  send(job.data)
    .then(result => handleResult(result, done))
    .catch(handleError);
});

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
