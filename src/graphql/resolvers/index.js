'use strict';

const path = require('path');
const { importSchema } = require('graphql-import');
const { extractFragmentReplacements } = require('prisma-binding');
const Query = require('./Query');
const Mutation = require('./Mutation');
const User = require('./User');
const Subscription = require('./Subscription');

const typeDefs = importSchema(path.resolve('./src/graphql/schema.graphql'));

const resolvers = {
  Query,
  Mutation,
  User,
  Subscription,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

module.exports = { typeDefs, resolvers, fragmentReplacements };
