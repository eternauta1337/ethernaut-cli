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
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    try {
      const info = getLevelInfo(level);

      output.result(`Name: ${info.name}`);
      output.result(`Contract name: ${info.contractName}`);
      output.result(`ABI path: ${info.abiPath}`);
      output.result(`Address: ${info.levelAddress}`);

      if (info.revealCode) {
        output.result('---------------------------------------');
        output.result('Source:');
        output.result('---------------------------------------');
        output.result(info.source);
      }

      output.result('---------------------------------------');
      output.result('Description:');
      output.result('---------------------------------------');
      output.result(info.description);
    } catch (err) {
      output.problem(err.message);
    }
  });

function getLevelInfo(level) {
  const gamedata = helper.getGamedata();

  const idx = parseInt(level) - 1;
  const levelInfo = gamedata.levels[idx];
  debug.log(`Level info: ${levelInfo}`, 'challenges');

  const name = levelInfo.name;
  const contractName = levelInfo.instanceContract.split('.')[0];

  const abisPath = path.join(process.cwd(), 'artifacts', 'interact', 'abis');
  const abiPath = path.join(abisPath, `${contractName}.json`);

  const sourcesPath = path.join(__dirname, '..', 'extracted', 'contracts');
  const sourcePath = path.join(sourcesPath, `${contractName}.sol`);
  const source = fs.readFileSync(sourcePath, 'utf8');

  const description = helper.getLevelDescription(levelInfo.description);

  const deploymentInfo = helper.getDeploymentInfo();
  const levelAddress = deploymentInfo[level];

  return {
    name,
    contractName,
    abiPath,
    levelAddress,
    source,
    description,
    revealCode: levelInfo.revealCode,
  };
}
