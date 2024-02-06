const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const fs = require('fs');
const path = require('path');

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

    console.log('Name:', name);
    console.log('Contract name:', contractName);
    console.log('ABI path:', abiPath);
    console.log('Address:', levelAddress);
    console.log('---------------------------------------');
    console.log('Source:');
    console.log('---------------------------------------');
    console.log(source);
    console.log('---------------------------------------');
    console.log('Description:');
    console.log('---------------------------------------');
    console.log(description);
  });
