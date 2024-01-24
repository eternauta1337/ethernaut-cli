const { Command } = require('commander');
const { addCommands } = require('./internal/commander/add-commands');
const { completion } = require('./internal/commander/completion');
const { asyncSpawn } = require('./internal/commander/async-spawn');

const program = new Command();

async function runCompletion(command) {
  const answer = await completion(command);
  const args = answer.split(' ');

  await asyncSpawn(args).catch((err) => console.error(err));

  await runCompletion(command);
}

program
  .name('ethernaut')
  .description('Swiss army superweapon for ethernauts')
  .version('0.8.0')
  .action(async () => await runCompletion(program));

addCommands('commands', program);

program.parse();
