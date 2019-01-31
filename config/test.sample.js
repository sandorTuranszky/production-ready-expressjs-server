'use strict';

module.exports = {
  app: {
    port: 5000,
    logging: {
      file: true,
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
      url: 'your-redis-url', // Required
      retryStrategy: 1000,
    },
  },
  apollo: {
    playgroundPath: '/graphql',
  },
  mailjet: {
    api_key: 'your-mailjet-api-key',
    secret: 'your-mailjet-secret',
  },
  sentry: {
    dsn: 'your-sentry-dsn', // Required
  },
  mock: {
    crashAppRoutes: true,
  },
};
