'use strict';

const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const errorMsg = 'Wrong email or password';

const Mutation = {
  async createUser(parent, args, { prisma }, info) { //eslint-disable-line
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
  async login(parent, { data }, { prisma }, info) { //eslint-disable-line
    const { email, password } = data;
    const user = await prisma.query.user({
      where: {
        email,
      },
    });

    if (!user) throw new Error(errorMsg);

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error(errorMsg);
    const token = jwt.sign({ userId: user.id }, config.get('app.secret'));

    return {
      user,
      token,
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
