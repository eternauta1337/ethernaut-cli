const { Command } = require('commander');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

const command = new Command();

command
  .name('level-instance')
  .description('Creates a level instance')
  .argument('<level-name>', 'The name of the level')
  .action(async (levelId) => {
    // Find the level js file
    const levelPath = path.resolve(__dirname, `../../levels/${levelId}.js`);
    if (!fs.existsSync(levelPath)) {
      logger.error('Level not found:', levelId);
    }

    // Load the level and deploy the instance
    const level = require(levelPath);
    const instance = await level.createInstance();
    logger.output(`Instance address: <${instance.target}>`);

    // Print the level info
    const info = level.info();
    logger.info(`Level info: ${info}`);
  });

module.exports = command;
