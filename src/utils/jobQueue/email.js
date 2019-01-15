'use strict';

const boom = require('boom');
const { createTask } = require('./helpers');
const { defaults } = require('./config');
const { queue } = require('./helpers');
const { send } = require('./integrations/mailjet');
const winston = require('../logger/winston');

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
 * Send email - MailJet implementation
 * Any other email service can be used instead
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
