'use strict';

const mongoose = require('mongoose');
const config = require('config');
const winston = require('../utils/logger/winston');

const dbURI = config.get('db.mongoose.url');

mongoose.Promise = global.Promise;

function onError(err) {
  winston.error(`MongoDB Atlas connection error: ${err}`);
}

function onConnected() {
  winston.log('debug', 'Connected to MongoDB Atlas!');
}

function onReconnected() {
  winston.warn('MongoDB Atlas reconnected!');
}

function onSIGINT() {
  // eslint-disable-next-line no-undef
  db.close(() => {
    winston.warn('MongoDB Atlas default connection disconnected through app termination!');
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
}

function connect() {
  mongoose.connect(
    dbURI,
    {
      useNewUrlParser: true,
      auto_reconnect: config.get('db.mongoose.auto_reconnect'),
    },
  );
  const db = mongoose.connection;

  db.on('error', onError);
  db.on('connected', onConnected);
  db.on('reconnected', onReconnected);

  process.on('SIGINT', onSIGINT);
}

module.exports = connect;
