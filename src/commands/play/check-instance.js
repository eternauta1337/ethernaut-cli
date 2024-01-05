const { Command } = require('commander');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');
const hre = require('hardhat');

const command = new Command();

command
  .name('check-instance')
  .description('Checks a level instance')
  .argument('<level-name>', 'The name of the level')
  .argument('<instance-address>', 'The address of the level instance to check')
  .action(async (levelId, instanceAddress) => {
    // Find the level js file
    const levelPath = path.resolve(__dirname, `../../levels/${levelId}.js`);
    if (!fs.existsSync(levelPath)) {
      logger.error('Level not found:', levelId);
    }

    // Load the level
    const level = require(levelPath);

    // Build the instance
    const instance = await hre.ethers.getContractAt(levelId, instanceAddress);
    const success = await level.validateInstance(instance);

    // Print the result
    if (success) {
      logger.output('Level complete!!!');
    } else {
      logger.error('Level not completed');
    }
  });

module.exports = command;
