'use strict';

const { getUserId } = require('../utils');

const Query = {
  users(parent, args, { prisma }, info) {
    return prisma.query.users(null, info);
  },
  me(parent, args, { prisma, req }, info) {//eslint-disable-line
    const userId = getUserId({ req });

    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },
};

module.exports = Query;
