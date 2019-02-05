'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

function getUserId(context) {
  const Authorization = context.req.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, config.get('app.secret'));
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  getUserId,
};
