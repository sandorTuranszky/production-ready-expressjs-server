'use strict';

module.exports = {
  app: {
    port: 5000,
    secret: 'your-secret', // Required
    logging: {
      file: true,
    },
  },
  db: {},
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
