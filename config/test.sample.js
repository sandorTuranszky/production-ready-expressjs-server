'use strict';

module.exports = {
  app: {
    port: 5000,
    secret: 'your-secret', // Required
    logging: {
      file: true,
    },
  },
  db: {
    mongoose: {
      url: 'your-mongodb-url', // Required
      auto_reconnect: true,
    },
    redis: {
      url: 'your-redis-url', // Required and the value must be strictly <your-redis-url> as it is replaced with correct Redis url value in Travis CI
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
    dsn: 'your-sentry-dsn', // Required and the value must be strictly <your-sentry-dsn> as it is replaced with correct DSN value in Travis CI
  },
  mock: {
    crashAppRoutes: true,
  },
};
