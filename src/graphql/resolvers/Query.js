'use strict';

const { getUserId } = require('../utils');

const Query = {
  users(parent, args, { prisma, req }, info) {
    const userId = getUserId({ req });//eslint-disable-line
    return prisma.query.users(null, info);
  },
  me() {
    return {
      id: '',
      name: '',
      email: '',
    };
  },
};

module.exports = Query;
