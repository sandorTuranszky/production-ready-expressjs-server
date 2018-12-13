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
      user: '', // required
      password: '', // required
      dbName: '', // required
      auto_reconnect: true,
    },
  },
  mock: {
    crashAppRoutes: true,
  },
};
