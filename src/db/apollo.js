'use strict';

const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const { prisma } = require('./prisma');
const Query = require('../graphql/resolvers/Query');
const Mutation = require('../graphql/resolvers/Mutation');

const typeDefs = importSchema(path.resolve('./src/graphql/schema.graphql'));
const resolvers = {
  Query,
  Mutation,
};

let server = null;

const initialize = app => {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: req => ({
      ...req,
      prisma,
    }),
  });

  server.applyMiddleware({ app });
};

module.exports = {
  initialize,
  server,
};
