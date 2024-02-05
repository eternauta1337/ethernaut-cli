const { types } = require('hardhat/config');
const oz = require('../scopes/oz');
const helper = require('../internal/oz');
const path = require('path');

oz.task('info', 'Shows information about a level')
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

    const name = levelInfo.name;
    const contractName = levelInfo.instanceContract.split('.')[0];

    const abisPath = path.join(process.cwd(), 'artifacts', 'interact', 'abis');
    const abiPath = path.join(abisPath, `${contractName}.json`);

    const description = helper.getLevelDescription(levelInfo.description);

    const deploymentInfo = helper.getDeploymentInfo();
    const levelAddress = deploymentInfo[level];

    console.log('Name:', name);
    console.log('Contract name:', contractName);
    console.log('ABI path:', abiPath);
    console.log('Address:', levelAddress);
    console.log('Description:');
    console.log('---------------------------------------');
    console.log(description);
    console.log('---------------------------------------');
  });
