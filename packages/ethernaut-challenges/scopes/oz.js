const { scope } = require('hardhat/config');
const { description } = require('../package.json');

const oz = scope('oz', description);

module.exports = oz;
