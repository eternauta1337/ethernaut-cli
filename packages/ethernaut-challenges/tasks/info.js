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

      output.resultBox({
        title: `Ethernaut Challenge #${level}`,
        msgs: [
          `Level name: ${info.name}`,
          `Contract name: ${info.contractName}`,
          `ABI path: ${info.abiPath}`,
          `Address: ${info.levelAddress}`,
        ],
      });
      output.resultBox({ title: 'Description', msgs: [info.description] });
      output.resultBox({ title: 'Source', msgs: [info.source] });
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
