'use strict';

const { Prisma } = require('prisma-binding');
const { fragmentReplacements } = require('../graphql/resolvers');

const port = 4466;

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: `http://prisma:${port}`,
  secret: 'putYourSuperSecretTextHere',
  fragmentReplacements,
});

module.exports = {
  prisma,
};
