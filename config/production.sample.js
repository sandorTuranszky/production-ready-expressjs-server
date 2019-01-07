'use strict';

module.exports = {
  app: {
    port: 7000,
    logging: {
      file: false,
    },
  },
  db: {
    mongoose: {
      user: '', // Required
      password: '', // Required
      dbName: '', // Required
      auto_reconnect: true,
    },
    redis: {
      url: '', // Required
      retryStrategy: 1000,
    },
  },
  sentry: {
    dsn: 'your-sentry-dsn',
  },
};
