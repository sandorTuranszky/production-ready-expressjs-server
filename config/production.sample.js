'use strict';

module.exports = {
  app: {
    port: 7000,
    secret: 'your-secret', // Required
    logging: {
      file: false,
    },
  },
  db: {
    mongoose: {
      url: 'your-mongodb-url', // Required
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
    dsn: 'your-dns', // Required
  },
};
