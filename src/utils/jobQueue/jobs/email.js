'use strict';

/**
 * Job to send single emails
 *
 *  @description
 *  Available properties:
 *  - subject (required)
 *  - to (required)
 *  - body (required)
 *  - htmlBody (optional)
 *  - fromEmail (optional)
 *  - fromName (optional)
 *  - nameTo (optional)
 */
const boom = require('boom');
const winston = require('../../logger/winston');
const { validateProps } = require('./helpers');
const { queue, defaults, saveTask } = require('../queues/kue');
const { send } = require('../integrations/mailjet');

const presetTemplates = {
  welcome: 'welcome-template',
};

/**
 * Required properties
 */
const props = ['subject', 'to', 'body'];

const createTask = args => validateProps(args, props) || saveTask(args);

const sendEmail = data => createTask({ type: 'email', ...data });

/**
 * Preset email template
 * @param {*} data
 * @param {*} options
 */
const sendWelcomeEmail = (data, options) =>
  sendEmail({
    data: { ...data, ...{ template: presetTemplates.welcome } },
    options,
  });

/**
 * Success handler
 * @param {*} result
 * @param {*} done
 */
const handleResult = (result, done) => {
  winston.info(`Email sent: ${JSON.stringify(result)}`);
  done();
};

/**
 * Error handler
 * @param {*} err
 */
const handleError = err => {
  winston.error(`Error occurred during sending email: ${boom.boomify(err)}`);
};

/**
 * Kue and mailjet specific implementation
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
