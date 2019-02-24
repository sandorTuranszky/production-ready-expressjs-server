'use strict';

const { queue, email } = require('./kue');

module.exports = {
  queue, // Queue instance
  email,
};
