'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const asyncMiddlewareGraphQl = require('../../utils/asyncMiddlewareGraphQl');
const { getUserId } = require('../utils');

const errorMsg = 'Wrong email or password';

async function createUser(parent, args, { prisma }, info) { //eslint-disable-line
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
}

async function login(parent, { data }, { prisma }, info) { //eslint-disable-line
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
}

function updateUser(parent, args, { prisma, req }, info) {
  const userId = getUserId({ req });
  return prisma.mutation.updateUser(
    {
      where: {
        id: userId,
      },
      data: args.data,
    },
    info,
  );
}

async function deleteUser(parent, args, { prisma, req }, info) {
  const userId = getUserId({ req });
  return prisma.mutation.deleteUser(
    {
      where: {
        id: userId,
      },
    },
    info,
  );
}

async function createVerificationToken(parent, { userId }, { prisma }, info) { //eslint-disable-line
  const token = await crypto.randomBytes(16).toString('hex');
  return prisma.mutation.createVerificationToken({
    data: { userId, token, createdAt: new Date() },
  });
}

async function verifyEmail(parent, { token }, { prisma }, info) { //eslint-disable-line
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
}

const Mutation = {
  createUser: asyncMiddlewareGraphQl(createUser),
  login: asyncMiddlewareGraphQl(login),
  deleteUser: asyncMiddlewareGraphQl(deleteUser),
  createVerificationToken: asyncMiddlewareGraphQl(createVerificationToken),
  verifyEmail: asyncMiddlewareGraphQl(verifyEmail),
  updateUser,
};

module.exports = Mutation;
