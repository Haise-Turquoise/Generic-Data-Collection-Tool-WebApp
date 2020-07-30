module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'warn',
    'no-restricted-syntax': 'warn',
    'no-await-in-loop': 'warn',
    'consistent-return': 'warn',
    'no-param-reassign': 'warn',
    'no-shadow': 'warn',
    'global-require': 'warn',
    'no-throw-literal': 'warn',
    'guard-for-in': 'warn',
    'no-unused-expressions': 'warn',
    eqeqeq: 'warn',
    'no-unused-vars': 'warn',
    'import/no-extraneous-dependencies': 'warn',
  },
};
