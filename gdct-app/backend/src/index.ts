// Set options as a parameter, environment variable, or rc file.
/* eslint-disable */
require = require('esm')(module /* , options */);
require('dotenv').config();
process.env.NODE_ENV = 'production';
module.exports = require('./server');
