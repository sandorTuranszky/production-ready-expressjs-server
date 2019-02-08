'use strict';

const { ApolloServer, PubSub } = require('apollo-server-express');
const winston = require('../utils/logger/winston');
const { prisma } = require('../db/prisma');
const { typeDefs, resolvers, fragmentReplacements } = require('../graphql/resolvers');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true, // Add tracing or cacheControl meta data to the GraphQL response @url https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  subscriptions: {
    onConnect: () => winston.info('Connected to websocket'),
    onDisconnect: webSocket => winston.info(`Disconnected from websocket ${webSocket}`),
  },
  context: req => ({
    ...req,
    pubSub,
    prisma,
  }),
  fragmentReplacements,
});

module.exports = {
  server,
};
