const { Command } = require('commander');
const unit = require('./unit');

const util = new Command();

util
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async (options) => {
    console.log('util:', options);
  });

util.addCommand(unit);

util.pickSubCommandPrompt = 'Pick a util';

module.exports = util;
