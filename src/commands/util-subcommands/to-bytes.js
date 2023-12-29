const { Command } = require('commander');
const ethers = require('ethers');
const { copyToClipboard } = require('../../utils/copy-to-clipboard');

const command = new Command();

command
  .name('to-bytes')
  .description('Converts stuff to bytes32')
  .argument('[value]', 'Value to convert')
  .action(async (value) => {
    const result = ethers.utils.formatBytes32String(value);

    copyToClipboard(result);

    console.log(result);
  });

module.exports = command;
