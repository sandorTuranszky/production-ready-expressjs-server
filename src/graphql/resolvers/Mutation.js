'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { getUserId } = require('../utils');
const asyncMiddlewareGraphQl = require('../../utils/asyncMiddlewareGraphQl');

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

function verifyToken(parent, { token }, { prisma }, info) { //eslint-disable-line
  return prisma.query.verificationToken({
    where: {
      token,
    },
  });
}

async function updateUserPassword(parent, { data }, { prisma, req }, info) {
  const userId = getUserId({ req });
  const { password, passwordRepeat } = data;

  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== passwordRepeat) throw new Error('Passwords do not match');

  return prisma.mutation.updateUser(
    {
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(password, 10),
      },
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
  updateUserPassword: asyncMiddlewareGraphQl(updateUserPassword),
  updateUser,
  verifyToken,
};

module.exports = Mutation;
