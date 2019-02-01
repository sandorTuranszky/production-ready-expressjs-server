'use strict';

const Subscription = {
  userCreated: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.user(
        {
          where: {
            mutation_in: ['CREATED'], // Subscribe to specific created nodes using filters @url https://www.prisma.io/docs/prisma-graphql-api/reference/subscriptions-qwe3/#subscribe-to-specific-created-nodes-using-filters
          },
        },
        info,
      );
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
