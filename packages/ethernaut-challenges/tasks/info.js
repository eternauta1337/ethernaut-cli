const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const fs = require('fs');
const path = require('path');
const logger = require('common/logger');

require('../scopes/oz')
  .task(
    'info',
    'Shows information about an open zeppelin challenges level. The info includes the level name, contract name, ABI path, address, and description. The ABI path can be used with the interact package call task to interact with the contract.'
  )
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    const gamedata = helper.getGamedata();

    const idx = parseInt(level) - 1;
    const levelInfo = gamedata.levels[idx];
    logger.debug('Level info:', levelInfo);

    const name = levelInfo.name;
    const contractName = levelInfo.instanceContract.split('.')[0];

    const abisPath = path.join(process.cwd(), 'artifacts', 'interact', 'abis');
    const abiPath = path.join(abisPath, `${contractName}.json`);

    const sourcesPath = path.join(
      '..',
      '..',
      'node_modules',
      'ethernaut',
      'contracts',
      'contracts',
      'levels'
    );
    const sourcePath = path.join(sourcesPath, `${contractName}.sol`);
    const source = fs.readFileSync(sourcePath, 'utf8');

    const description = helper.getLevelDescription(levelInfo.description);

    const deploymentInfo = helper.getDeploymentInfo();
    const levelAddress = deploymentInfo[level];

    logger.output('Name:', name);
    logger.output('Contract name:', contractName);
    logger.output('ABI path:', abiPath);
    logger.output('Address:', levelAddress);
    if (levelInfo.revealCode) {
      logger.output('---------------------------------------');
      logger.output('Source:');
      logger.output('---------------------------------------');
      logger.output(source);
    }
    logger.output('---------------------------------------');
    logger.output('Description:');
    logger.output('---------------------------------------');
    logger.output(description);
  });
