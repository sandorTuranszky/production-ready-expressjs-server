'use strict';

/**
 * MailJet API for sending basic email
 * @url https://dev.mailjet.com/guides/?javascript#sending-a-basic-email
 *
 * TODO: templates @url https://dev.mailjet.com/guides/?javascript#using-a-template
 */
const config = require('config');
const mailjet = require('node-mailjet').connect(
  config.get('mailjet.api_key'),
  config.get('mailjet.secret'),
);

const sendEmail = data =>
  mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: data.fromEmail,
          Name: data.fromName,
        },
        To: [
          {
            Email: data.to,
            Name: data.nameTo,
          },
        ],
        Subject: data.subject,
        TextPart: data.body,
        HTMLPart: data.htmlBody,
      },
    ],
  });

module.exports = {
  sendEmail,
};
