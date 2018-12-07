[![Build Status](https://travis-ci.org/sandorTuranszky/production-ready-expressjs-server.svg?branch=master)](https://travis-ci.org/sandorTuranszky/production-ready-expressjs-server)

![Build Status](https://img.shields.io/github/license/sandorTuranszky/production-ready-expressjs-server.svg)

This is an [Express.js](https://github.com/Automattic/kue) based Nodejs server that implements production-ready error handling and logging following latest best practices.

This is a backend server for my project that is COMING SOON. It inspired by an idea to quickly create a production ready project with all the required infrastructure at low cost yet with important security measures in place and ability to quickly scale in order to ship a quality product to early adopters. Ideal for quickly starting an app to validate ideas and scale if needed.

## Features

- Nodejs v. 10.\*
- Error handling
- Logging with Morgan and Winston
- Application Configuration with <a href="https://github.com/lorenwest/node-config" target="_blank">node-config</a>
- Linting
- Testing with Jets and Supertest
- Follows best practices from <a href="https://github.com/i0natan/nodebestpractices" target="_blank">The largest Node.JS best practices list</a>
  - https://github.com/i0natan/nodebestpractices#-11-structure-your-solution-by-components
  - https://github.com/i0natan/nodebestpractices#-11-structure-your-solution-by-components
  - https://github.com/i0natan/nodebestpractices#-14-separate-express-app-and-server
  - https://github.com/i0natan/nodebestpractices#-15-use-environment-aware-secure-and-hierarchical-config
  - https://github.com/i0natan/nodebestpractices#-21-use-async-await-or-promises-for-async-error-handling
  - https://github.com/i0natan/nodebestpractices#-22-use-only-the-built-in-error-object (decorated with Boom)
  - https://github.com/i0natan/nodebestpractices#-23-distinguish-operational-vs-programmer-errors
  - https://github.com/i0natan/nodebestpractices#-24-handle-errors-centrally-not-within-an-express-middleware
  - https://github.com/i0natan/nodebestpractices#-26-shut-the-process-gracefully-when-a-stranger-comes-to-town
  - https://github.com/i0natan/nodebestpractices#-27-use-a-mature-logger-to-increase-error-visibility
  - https://github.com/i0natan/nodebestpractices#-61-embrace-linter-security-rules
  - https://github.com/i0natan/nodebestpractices#-31-use-eslint
  - https://github.com/i0natan/nodebestpractices#-33-start-a-codeblocks-curly-braces-on-the-same-line
  - https://github.com/i0natan/nodebestpractices#-32-nodejs-specific-plugins
  - https://github.com/i0natan/nodebestpractices#-34-dont-forget-the-semicolon
  - https://github.com/i0natan/nodebestpractices#-37-prefer-const-over-let-ditch-the-var
  - https://github.com/i0natan/nodebestpractices#-38-requires-come-first-and-not-inside-functions
  - https://github.com/i0natan/nodebestpractices#-39-do-require-on-the-folders-not-directly-on-the-files
  - https://github.com/i0natan/nodebestpractices#-310-use-the--operator
  - https://github.com/i0natan/nodebestpractices#-310-use-the--operator
  - https://github.com/i0natan/nodebestpractices#-42-detect-code-issues-with-a-linter

I am always open to <a href="https://github.com/sandorTuranszky/production-ready-ExpressJs-server/issues" target="_blank">your feedback</a>

## ToDo:

- MongodDb with Mongoose
- Redis
- GraphQl integration
- Authentication with [passport.js](http://www.passportjs.org/) (Gmail, Facebook, LinkedIn, Twitter)
- Authentication with email/password + add/remove social accounts
- Password recovery
- GDPR ready (cookies, settings)
- Priority job queue with [Kue](https://github.com/Automattic/kue) (e.g: for sending transactional emails)
- [TypeScript](https://www.typescriptlang.org/) (maybe)

## Get started

- [Set up environment variables](#set-up-environment-variables)
- [Install and start Docker](#Install-and-start-docker)
- [Install dependencies](#Install-dependencies)
- [Run server](#run-server-in-dev-mode)
- [Test error handling](#test-error-handling)

## Set up environment variables

Rename `*.sample.js` files in `/server/config` directory:

- `default.sample.js -> default.js`
- `production.sample.js -> production.js`
- `test.sample.js -> test.js`

More details on how config works see [node-config](https://github.com/lorenwest/node-config).
You may also find [Securing production config files](https://github.com/lorenwest/node-config/wiki/Securing-Production-Config-Files) useful

## Install and start Docker

- Install [Docker](https://www.docker.com/get-started) (if not yet installed) and make sure it runs
- Run `docker-compose up`

## Install dependencies

- `npm install`

## Run server

- `npm run dev` - development mode or
- `npm run start` - production mode
- `docker-compose -f docker-compose.yml -f test-env.yml up` - run server in test environment

## Testing and linting

- `npm run test:unit` - run unit tests
- `npm run test:int` - run integration tests
- `npm run coverage` - test coverage
- `npm run lint` - lint

## Test error handling

- navigate to `/api/crash/` and click on any of the listed options

  Note, that crash routes for testing error handling are not available in `production` env

## Error handling implementation explained

- [Error handling Wiki](https://github.com/sandorTuranszky/production-ready-ExpressJs-server/wiki/Error-handling)
