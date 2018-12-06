'use strict';

module.exports = {
  app: {
    port: 5000,
    logging: {
      file: true,
    },
  },
  db: {},
  mock: {
    crashAppRoutes: true,
  },
};
