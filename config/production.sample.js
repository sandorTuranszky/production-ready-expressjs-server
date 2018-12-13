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
      user: '', // required
      password: '', // required
      dbName: '', // required
      auto_reconnect: true,
    },
    redis: {
      url: '', // required
      retryStrategy: 1000,
    },
  },
};
