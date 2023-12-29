const { Command } = require('commander');
const unit = require('./unit');
const toBytes = require('./to-bytes');
const toString = require('./to-string');

const util = new Command();

util
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async (options) => {
    console.log('util:', options);
  });

util.addCommand(unit);
util.addCommand(toBytes);
util.addCommand(toString);

util.pickSubCommandPrompt = 'Pick a util';

module.exports = util;
