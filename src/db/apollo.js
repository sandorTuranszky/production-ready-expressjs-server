'use strict';

const path = require('path');
const { ApolloServer, PubSub } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const app = require('../app');
// Const { PubSub } = require('graphql-subscriptions');
// Const { SubscriptionServer } = require('subscriptions-transport-ws');
const winston = require('../utils/logger/winston');
const { prisma } = require('./prisma');
const Query = require('../graphql/resolvers/Query');
const Mutation = require('../graphql/resolvers/Mutation');

const typeDefs = importSchema(path.resolve('./src/graphql/schema.graphql'));
const resolvers = {
  Query,
  Mutation,
};

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Todo: check if required
  playground: true, // Todo: check if required
  tracing: true,
  subscriptions: {
    onConnect: () => winston.info('Connected to websocket'),
    onDisconnect: webSocket => winston.info(`Disconnected from websocket ${webSocket}`),
  },
  context: req => ({
    ...req,
    prisma,
  }),
});

server.applyMiddleware({ app });

module.exports = {
  pubSub,
  server,
};
