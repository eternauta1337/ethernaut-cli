const { Command } = require('commander');

const command = new Command();

command
  .name('interact')
  .description('Interact with any contract')
  .usage(
    '--abi <path-to-abi> --address 0x123 --function <function-name> --params [param1, param2, ...]'
  )
  .option('-p, --abi <path-to-abi>', 'The path to the contract ABI')
  .option('-a, --address <address>', 'The address of the contract')
  .option('-f, --function <function-name>', 'The name of the function')
  .option('-p, --params <params>', 'The params to pass to the function')
  .action((options) => {
    console.log(options);
  });

module.exports = command;
