'use strict';

const Subscription = {
  user: {
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
