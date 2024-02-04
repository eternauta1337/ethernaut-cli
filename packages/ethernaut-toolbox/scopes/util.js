const { scope } = require('hardhat/config');
const { description } = require('../package.json');

const util = scope('util', description);

module.exports = util;
