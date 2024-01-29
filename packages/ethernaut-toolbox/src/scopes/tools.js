const { scope } = require('hardhat/config');
const { description } = require('../../package.json');

const tools = scope('tools', description);

module.exports = tools;
