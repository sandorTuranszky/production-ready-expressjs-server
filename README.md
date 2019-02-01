[![Build Status](https://travis-ci.org/sandorTuranszky/production-ready-expressjs-server.svg?branch=master)](https://travis-ci.org/sandorTuranszky/production-ready-expressjs-server)
[![Known Vulnerabilities](https://snyk.io/test/github/sandorTuranszky/production-ready-expressjs-server/badge.svg)](https://snyk.io/test/github/{username}/{repo})
[![codecov.io](https://codecov.io/github/sandorTuranszky/production-ready-expressjs-server/coverage.svg?branch=master)](https://codecov.io/github/sandorTuranszky/production-ready-expressjs-server?branch=master)
![License](https://img.shields.io/github/license/sandorTuranszky/production-ready-expressjs-server.svg)

This is an [Express.js](https://github.com/Automattic/kue) based Nodejs server that implements production-ready error handling and logging following latest best practices.

This is a backend server for my project that is COMING SOON. It inspired by an idea to quickly create a production ready project with all the required infrastructure at low cost yet with important security measures in place and ability to quickly scale in order to ship a quality product to early adopters. Ideal for quickly starting an app to validate ideas and scale if needed.

## Features

- Nodejs `v. 10.\*`
- Error handling `v1.0.0`
- Logging with Morgan and Winston
- Application Configuration with <a href="https://github.com/lorenwest/node-config" target="_blank">node-config</a>
- Linting
- Testing with Jets and Supertest
- MongodDb support with Mongoose `v1.1.0`
- Redis support `v1.2.0`
- Settings to push images to docker hub (optional)
- Sentry error tracking
- GraphQl integration with [apollo-server-express](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express) and [Prisma](https://www.prisma.io/)
- Priority job queue with [Kue](https://github.com/Automattic/kue) (e.g: for sending transactional emails). Queue implementation can be easily replaced with anything you prefer (apart from Kue). Emails (transactional) are sent with [mailjet](https://www.mailjet.com/) that offers 200 emails/day for free under the [Free](https://www.mailjet.com/pricing/) plan.
- Follows best practices from <a href="https://github.com/i0natan/nodebestpractices" target="_blank">The largest Node.JS best practices list</a>
  - [Structure your solution by components](https://github.com/i0natan/nodebestpractices#-11-structure-your-solution-by-components)
  - [Separate Express 'app' and 'server'](https://github.com/i0natan/nodebestpractices#-14-separate-express-app-and-server)
  - [Use environment aware, secure and hierarchical config](https://github.com/i0natan/nodebestpractices#-15-use-environment-aware-secure-and-hierarchical-config)
  - [Use Async-Await or promises for async error handling](https://github.com/i0natan/nodebestpractices#-21-use-async-await-or-promises-for-async-error-handling)
  - [Use only the built-in Error object](https://github.com/i0natan/nodebestpractices#-22-use-only-the-built-in-error-object) (decorated with Boom)
  - [Distinguish operational vs programmer errors](https://github.com/i0natan/nodebestpractices#-23-distinguish-operational-vs-programmer-errors)
  - [Handle errors centrally, not within an Express middleware](https://github.com/i0natan/nodebestpractices#-24-handle-errors-centrally-not-within-an-express-middleware)
  - [Shut the process gracefully when a stranger comes to town](https://github.com/i0natan/nodebestpractices#-26-shut-the-process-gracefully-when-a-stranger-comes-to-town)
  - [Use a mature logger to increase error visibility](https://github.com/i0natan/nodebestpractices#-27-use-a-mature-logger-to-increase-error-visibility)
  - [Use ESLint](https://github.com/i0natan/nodebestpractices#-31-use-eslint)
  - [Detect code issues with a linter](https://github.com/i0natan/nodebestpractices#-42-detect-code-issues-with-a-linter)    
  - [Embrace linter security rules](https://github.com/i0natan/nodebestpractices#-61-embrace-linter-security-rules)
  - [Node.js Specific Plugins](https://github.com/i0natan/nodebestpractices#-32-nodejs-specific-plugins)
  - [Start a Codeblock's Curly Braces on the Same Line](https://github.com/i0natan/nodebestpractices#-33-start-a-codeblocks-curly-braces-on-the-same-line)
  - [Don't Forget the Semicolon](https://github.com/i0natan/nodebestpractices#-34-dont-forget-the-semicolon)
  - [Prefer const over let. Ditch the var](https://github.com/i0natan/nodebestpractices#-37-prefer-const-over-let-ditch-the-var)
  - [Requires come first, and not inside functions](https://github.com/i0natan/nodebestpractices#-38-requires-come-first-and-not-inside-functions)
  - [Do Require on the folders, not directly on the files](https://github.com/i0natan/nodebestpractices#-39-do-require-on-the-folders-not-directly-on-the-files)
  - [Use the === operator](https://github.com/i0natan/nodebestpractices#-310-use-the--operator)

This project uses [Git hook](https://github.com/m1foley/fit-commit) to validate commit messages based on community standards

I am always open to <a href="https://github.com/sandorTuranszky/production-ready-ExpressJs-server/issues" target="_blank">your feedback</a>

## ToDo:

- Authentication with [passport.js](http://www.passportjs.org/) (Gmail, Facebook, LinkedIn, Twitter)
- Authentication with email/password + add/remove social accounts
- Password recovery
- GDPR ready (cookies, settings)
- [TypeScript](https://www.typescriptlang.org/) (maybe)

## Get started

- [Set up environment variables](#set-up-environment-variables)
- [Install and start Docker](#Install-and-start-docker)
- [Install dependencies](#Install-dependencies)
- [Create account and connect to MongoDB Atlas cloud instance using the FREE plan](#Create-account-and-connect-to-MongoDB-Atlas-cloud-instance-using-the-FREE-plan)
- [Set up Prisma](#set-up-Prisma)
- [Create account and connect to RedisLabs cloud instance using the FREE plan](#Create-account-and-connect-to-RedisLabs-cloud-instance-using-the-FREE-plan)
- [Create account and setup Sentry error tracking](#Create-account-and-setup-Sentry-error-tracking)
- [Create account and setup MailJet to send transactional emails](#Create-account-and-setup-MailJet-to-send-transactional-emails)
- [Kue UI dashboard](#kue-ui-dashboard)
- [Run server](#run-server)
- [Making changes to Graphql schemas](#making-changes-to-Graphql-schemas)
- [Test error handling](#test-error-handling)

## Additional settings
- [Pushing images to docker hub (optional)](#pushing-images-to-docker-hub)

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

## Create account and connect to MongoDB Atlas cloud instance using the FREE plan

- Create an account with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/pricing) using the FREE plan and follow instructions [here](https://docs.atlas.mongodb.com/getting-started/)

## Set up Prisma
- Prisma serves as an ORM and to make it work you need to provide MongoDB connection string (you should have it from the previous step by now) in the `.env` file in the project root.
- Schema is defined here `./prisma/datamodel.prisma`
- Use `npm run get-schema` to download schema from endpoint to `./src/generated/prisma.graphql`. Note that it will run automatically on `prisma deploy` or `(npm run deploy)` as it is set up in `post-deploy` hook in `/prisma/prisma.yml`
- Prisma GraphQl playground is available here `http://localhost:4466`
- Apollo server GraphQl playground - `http://localhost:3030/graphql`

## Create account and connect to RedisLabs cloud instance using the FREE plan
- Create an account with [Redislabs](https://redislabs.com/get-started/) using the FREE plan (choose Cloud Hosted - free up to 30MB) and follow instructions [here](https://docs.redislabs.com/latest/rc/quick-setup-redis-cloud/)

## Create account and setup Sentry error tracking
- Create a Sentry account [here](https://sentry.io/welcome/)
- Add `your-sentry-dsn` to all configuration files in `/config` dir

```
  sentry: {
    dsn: 'your-sentry-dsn',
  },
```

## Create account and setup MailJet to send transactional emails
- Create a MailJet account [here](https://www.mailjet.com/)
- Add `your-mailjet-api-key` and `your-mailjet-secret` to all configuration files in `/config` dir

```
  mailjet: {
    api_key: 'your-mailjet-api-key',
    secret: 'your-mailjet-secret',
  },
```
- Important!!! You need to use a domain-based email address as an email sender (e.g. your project's domain name) to ensure emails are delivered to the inbox. Otherwise, they will end up in spam (including example@gmail.com once). In your MailJet account you can verify your email and take additional measures (e.g.SPF and DKIM settings) to ensure your emails are delivered.

## Kue UI dashboard
- The dashboard is available under `http://localhost:3050/active` or via nginx `http://localhost:3030/kue/active`

## Run server

- `npm run dev` - development mode or
- `npm run start` - production mode
- `docker-compose -f docker-compose.yml -f test-env.yml up` - run server in test environment

## Testing and linting

- `npm run test:unit` - run unit tests
- `npm run test:int` - run integration tests
- `npm run coverage` - test coverage
- `npm run lint` - lint

## Making changes to Graphql schemas

- update/add data model `/prisma/datamodel.prisma`
- update/add schema `/src/graphql/schema.graphql`
- update/add queries, mutations or subscriptions `/src/graphql/resolvers/`
- run `npm run deploy` to update prisma data model and generate schema in `/generated`

## Test error handling

- navigate to `/api/crash/` and click on any of the listed options

  Note, that crash routes for testing error handling are not available in `production` env

## Error handling implementation explained

- [Error handling Wiki](https://github.com/sandorTuranszky/production-ready-ExpressJs-server/wiki/Error-handling)

## Pushing images to docker hub
  To push images to [Docker Hub](https://hub.docker.com/) you need to provide your Docker user name and password as environment variables.
  Refer to [Travis documentation](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings) for more details
  
  Once environment variables set, uncomment related lines in `.travis.yml` file
