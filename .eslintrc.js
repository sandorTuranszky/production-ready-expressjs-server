module.exports = {
  plugins: ['security', 'jest', 'mocha'],
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'node/prefer-global/url': ['error', 'always'],
    'node/no-missing-require': 'error',
    'node/no-deprecated-api': [
      'error',
      {
        ignoreModuleItems: [],
        ignoreGlobalItems: [],
      },
    ],
    'node/no-unpublished-bin': [
      'error',
      {
        convertPath: null,
      },
    ],
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: [],
      },
    ],
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: [],
      },
    ],
    'node/no-unsupported-features/es-builtins': [
      'error',
      {
        ignores: [],
      },
    ],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: [],
      },
    ],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        ignores: [],
      },
    ],
    // 'node/shebang': ['error', { convertPath: null }],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-identical-title': 'error',
    'mocha/no-nested-tests': 'error',
    'mocha/valid-suite-description': [1, '^[A-Z]'],
  },
};
