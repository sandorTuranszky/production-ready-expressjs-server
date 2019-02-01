'use strict';

const Subscription = {
  userCreated: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.user({}, info);
    },
  },
  userUpdated: {
    subscribe(parent, { userId }, { prisma }, info) {
      return prisma.subscription.user(
        {
          where: {
            node: {
              id: userId,
            },
          },
        },
        info,
      );
    },
  },
};

module.exports = Subscription;
