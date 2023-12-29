const { Command, Option } = require('commander');
const ethers = require('ethers');
const { copy } = require('copy-paste');

const command = new Command();

command
  .name('to-bytes')
  .description('Converts stuff to bytes32')
  .argument('[value]', 'Value to convert')
  .action(async (value) => {
    const result = ethers.utils.formatBytes32String(value);

    copy(result, () => {});

    console.log(`${value} to bytes32:\n${result}\n(copied to clipboard)`);
  });

module.exports = command;
