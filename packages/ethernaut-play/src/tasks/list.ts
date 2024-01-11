import { play } from '../scopes/play';

play
  .task('list', 'Lists all Ethernaut levels')
  .setAction(async (taskArgs, hre) => {
    console.log('Listing levels...');
  });
