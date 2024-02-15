const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const fs = require('fs');
const path = require('path');
const output = require('common/output');
const debug = require('common/debug');

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

      output.infoBox(info.description, 'Description');
      output.infoBox(info.source, 'Source Code');
      output.resultBox(
        `Level name: ${info.name}\n` +
          `Contract name: ${info.contractName}.sol\n` +
          `ABI path: ${info.abi}\n` +
          `Address: ${info.levelAddress}`,
        `Ethernaut Challenge #${level}`
      );
    } catch (err) {
      output.errorBox(err);
    }
  });

function getLevelInfo(level) {
  const gamedata = helper.getGamedata();

  const idx = parseInt(level) - 1;
  const levelInfo = gamedata.levels[idx];
  debug.log(`Level info: ${levelInfo}`, 'challenges');

  const name = levelInfo.name;
  const contractName = levelInfo.instanceContract.split('.')[0];

  const abi = path.join(helper.getAbisPath(), `${contractName}.json`);

  const sourcePath = path.join(helper.getSourcesPath(), `${contractName}.sol`);
  const source = fs.readFileSync(sourcePath, 'utf8');

  const description = helper.getLevelDescription(levelInfo.description);

  const deploymentInfo = helper.getDeploymentInfo();
  const levelAddress = deploymentInfo[level];

  return {
    name,
    contractName,
    abi,
    levelAddress,
    source,
    description,
    revealCode: levelInfo.revealCode,
  };
}
