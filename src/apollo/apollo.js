'use strict';

const path = require('path');
const { ApolloServer, PubSub } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const winston = require('../utils/logger/winston');
const { prisma } = require('../db/prisma');
const Query = require('../graphql/resolvers/Query');
const Mutation = require('../graphql/resolvers/Mutation');
const Subscription = require('../graphql/resolvers/Subscription');

const typeDefs = importSchema(path.resolve('./src/graphql/schema.graphql'));
const resolvers = {
  Query,
  Mutation,
  Subscription,
};

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
});

module.exports = {
  server,
};
