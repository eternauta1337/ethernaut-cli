import { types } from 'hardhat/config';
import { play } from '../scopes/play';

play
  .task('play', 'Plays the game')
  .setAction(async ({ amount, from, to }, hre) => {
    console.log('Playing the game...');
  });
