'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');

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
  async deleteUser(parent, args, { prisma, req }, info) {
    const userId = getUserId({ req });//eslint-disable-line
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info,
    );
  },
  updateUser(parent, args, { prisma, req }, info) {
    const userId = getUserId({ req }); //eslint-disable-line
    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info,
    );
  },
  async createVerificationToken(parent, { userId }, { prisma }, info) { //eslint-disable-line
    const token = await crypto.randomBytes(16).toString('hex');
    return prisma.mutation.createVerificationToken({
      data: { userId, token, createdAt: new Date() },
    });
  },
  async verifyEmail(parent, { token }, { prisma }, info) { //eslint-disable-line
    const response = await prisma.query.verificationToken({
      where: {
        token,
      },
    });

    if (!response) throw new Error('Token is invalid');

    return prisma.mutation.updateUser(
      {
        where: {
          id: response.userId,
        },
        data: { emailVerified: true },
      },
      info,
    );
  },
};

module.exports = Mutation;
