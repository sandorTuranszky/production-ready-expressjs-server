'use strict';

const { GraphQLServer } = require('graphql-yoga');
const winston = require('../src/utils/logger/winston');
const Query = require('../src/graphql/resolvers/Query');
const Mutation = require('../src/graphql/resolvers/Mutation');
const { prisma } = require('../src/db');

const port = 4000;

const server = new GraphQLServer({
  typeDefs: '../app/src/graphql/schema.graphql',
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    prisma,
  },
});

server.start({ port }, () => {
  winston.info(`Graphql Yoga Server listening on ${port}`);
});
