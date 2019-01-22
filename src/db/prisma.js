'use strict';

const { Prisma } = require('prisma-binding');

const port = 4466;

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: `http://prisma:${port}`,
});

module.exports = {
  prisma,
};
