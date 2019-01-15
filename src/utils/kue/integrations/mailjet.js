'use strict';

const boom = require('boom');
const config = require('config');
const mailjet = require('node-mailjet').connect(
  config.get('mailjet.api_key'),
  config.get('mailjet.secret'),
);

const winston = require('../../logger/winston');

const handleError = err => {
  winston.error(`Error occurred during sending email: ${boom.boomify(err)}`);
};

const send = data => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: data.fromEmail,
          Name: data.fromName,
        },
        To: [
          {
            Email: data.to,
            Name: 'passenger 1',
          },
        ],
        Subject: data.subject,
        TextPart: data.body,
        HTMLPart:
          '<h3>Dear passenger 1, welcome to Mailjet!</h3><br />May the delivery force be with you!',
      },
    ],
  });
  request.then(result => result).catch(handleError);
};

module.exports = {
  send,
};
