'use strict';

const { GraphQLServer } = require('graphql-yoga');
const winston = require('../utils/logger/winston');

const port = 4050;

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({ port }, () => winston.info(`Server is running on localhost: ${port}`));
