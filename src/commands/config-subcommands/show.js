const { Command } = require('commander');
const storage = require('../../utils/storage');

const command = new Command();

command
  .name('show')
  .description('Show all current config properties')
  .action(async () => {
    console.log(`\nCurrent provider: ${storage.config.provider.current}`);
  });

module.exports = command;
