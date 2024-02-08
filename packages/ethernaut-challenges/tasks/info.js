const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const fs = require('fs');
const path = require('path');
const output = require('common/output');
const debug = require('common/debugger');

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
    debug.log(`Level info: ${levelInfo}`, 'challenges');

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

    output.result(`Name: ${name}`);
    output.result(`Contract name: ${contractName}`);
    output.result(`ABI path: ${abiPath}`);
    output.result(`Address: ${levelAddress}`);
    if (levelInfo.revealCode) {
      output.result('---------------------------------------');
      output.result('Source:');
      output.result('---------------------------------------');
      output.result(source);
    }
    output.result('---------------------------------------');
    output.result('Description:');
    output.result('---------------------------------------');
    output.result(description);
  });
