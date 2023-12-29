const { Command } = require('commander');
const ethers = require('ethers');
const { copyToClipboard } = require('../../utils/copy-to-clipboard');

const command = new Command();

command
  .name('to-string')
  .description('Converts bytes32 to string')
  .argument('[value]', 'Value to convert')
  .action(async (value) => {
    const result = ethers.utils.toUtf8String(value);

    copyToClipboard(result);

    console.log(result);
  });

module.exports = command;
