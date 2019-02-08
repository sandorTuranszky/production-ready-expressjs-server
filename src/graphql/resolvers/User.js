'use strict';

const { getUserId } = require('../utils');

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { req }, info) { //eslint-disable-line
      const userId = getUserId({ req }, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    },
  },
};

module.exports = User;
