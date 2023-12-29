const { Command } = require('commander');
const unit = require('./unit');
const { pickSubCommand } = require('../../utils/interactive');

const util = new Command();

util
  .name('util')
  .description('Utilities for Ethereum hackers')
  .action(async () => {
    await pickSubCommand(util);
  });

util.addCommand(unit);

module.exports = util;
