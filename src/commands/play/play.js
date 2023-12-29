const { Command } = require('commander');

const play = new Command();

play
  .name('play')
  .description('Play The Ethernaut on the CLI')
  .action(async () => {});

module.exports = play;
