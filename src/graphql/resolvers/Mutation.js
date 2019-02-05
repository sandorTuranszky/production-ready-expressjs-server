'use strict';

const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const Mutation = {
  async signUp(parent, args, { prisma }, info) { //eslint-disable-line
    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    const token = jwt.sign({ userId: user.id }, config.get('app.secret'));

    return {
      token,
      user,
    };
  },
  async login(parent, args, context, info) {
    const user = await context.prisma.query.users({ email: args.email }, info);
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id }, config.get('app.secret'));

    return {
      token,
      user,
    };
  },
  async deleteUser(parent, args, { prisma }, info) {
    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id,
        },
      },
      info,
    );
  },
  updateUser(parent, args, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info,
    );
  },
};

module.exports = Mutation;
