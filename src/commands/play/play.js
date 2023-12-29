const { Command } = require('commander');
// const { pickSubCommand } = require('../../utils/interactive');

const play = new Command();

play
  .name('play')
  .description('Play The Ethernaut on the CLI')
  .action(async () => {
    // await pickSubCommand(play);
  });

module.exports = play;
