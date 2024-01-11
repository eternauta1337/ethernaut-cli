import { play } from '../scopes/play';
// TODO: It seems like enquirer is not exporting these types
// See: https://github.com/enquirer/enquirer/issues/448
// @ts-ignore
import { Select } from 'enquirer';
import fs from 'fs';
import path from 'path';

play
  .task('list', 'Lists all Ethernaut levels')
  .setAction(async (taskArgs, hre) => {
    const gamedata = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/gamedata.json'), 'utf8')).levels;

    const choices = gamedata.map((level: any) => {
      return level.name
    });

    const prompt = new Select({
      name: 'level',
      message: 'Pick a level',
      limit: 10,
      choices
    });

    const response = await prompt.run()

    const level = gamedata.find((level: any) => level.name === response);
    console.log(level);

    const info = fs.readFileSync(path.join(__dirname, '../data/levels', `${level.description}`), 'utf8');
    console.log(info)
  });
