'use strict';

const defaults = {
  email: {
    body: '',
    delay: 0,
    remove: false,
    priority: 'normal',
    attempts: 5,
    template: 'default-template',
    concurrency: 10,
  },
};

const defaultOptions = type => {
  // eslint-disable-next-line security/detect-object-injection
  const { delay, priority, attempts, remove } = defaults[type];
  return {
    delay,
    priority,
    attempts,
    remove,
  };
};

module.exports = {
  defaults,
  defaultOptions,
};
