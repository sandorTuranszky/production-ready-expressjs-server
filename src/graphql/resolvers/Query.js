'use strict';

const Query = {
  users(parent, args, { prisma }, info) {
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
