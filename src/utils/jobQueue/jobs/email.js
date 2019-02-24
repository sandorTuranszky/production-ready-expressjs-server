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
const { send } = require('../integrations');

/**
 * Required properties
 */
const props = ['subject', 'to', 'body'];

/**
 * Preset templates
 */
const presetTemplates = {
  welcome: 'welcomeTemplate',
  emailVerification: 'emailVerification',
  default: 'default',
};

const manageTemplate = data => ({
  ...{ ...data, template: presetTemplates[data.template] || presetTemplates.default },
});

/**
 * Validate Email
 * @param {*} data
 */
const validate = data => validateProps(data, props);

/**
 * Success handler
 * @param {*} result
 * @param {*} done
 */
const handleSuccess = (result, cb) => {
  winston.info(`Email sent: ${JSON.stringify(result)}`);
  if (cb && typeof cb === 'function') cb();
};

/**
 * Error handler
 * @param {*} err
 */
const handleError = err =>
  winston.error(`Error occurred during sending email: ${boom.boomify(err)}`);

/**
 * Send email
 * @param {*} data
 *
 * Returns promise
 */
const process = data => {
  const email = manageTemplate(data);
  const invalidEmail = validate(email);
  if (invalidEmail) throw new Error(invalidEmail);

  return send(email.data);
};

/**
 * All jobs must expose the following interface
 */
module.exports = {
  process,
  handleSuccess,
  handleError,
};
