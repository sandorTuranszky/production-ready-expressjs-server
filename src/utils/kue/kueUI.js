'use strict';

const kue = require('kue');
const config = require('config');
const winston = require('../logger/winston');

const port = 3050;

kue.createQueue({
  redis: config.get('db.redis.url'),
});

kue.app.set('title', 'Production ready ExpressJs server"');

kue.app.listen(port, () => winston.info(`Kue UI app listening on http://localhost:${port}`));
