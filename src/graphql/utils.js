'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
const getUserId = (context, requireAuth = true) => {
  const Authorization = context.req.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, config.get('app.secret'));
    return userId;
  }

  if (requireAuth) throw new Error('Not authenticated');
};

module.exports = {
  getUserId,
};
