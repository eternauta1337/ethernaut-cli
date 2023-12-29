const { Command, Option } = require('commander');
const ethers = require('ethers');
const { copy } = require('copy-paste');

const command = new Command();

command
  .name('to-string')
  .description('Converts bytes32 to string')
  .argument('[value]', 'Value to convert')
  .action(async (value) => {
    const result = ethers.utils.toUtf8String(value);

    copy(result, () => {});

    console.log(`${value} to string:\n${result}\n(copied to clipboard)`);
  });

module.exports = command;
