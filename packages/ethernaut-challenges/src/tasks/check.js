const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const output = require('common/output');
const spinner = require('common/spinner');
const findLevelCompletedEvents = require('../internal/level-completed-logs');

require('../scopes/oz')
  .task(
    'check',
    'Checks if the player has completed the specified level by submitting an instance modified as per the levels requirements'
  )
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    try {
      const completed = await checkLevel(level, hre);
      if (completed) return output.resultBox('Level completed');
      else return output.warnBox('Level not completed');
    } catch (err) {
      output.errorBox(err);
    }
  });

async function checkLevel(level, hre) {
  const deploymentInfo = helper.getDeploymentInfo();

  // Prepare the main game contract
  const gameAddress = deploymentInfo.ethernaut;
  const abi = helper.getEthernautAbi();
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

  // Get player address
  const signer = (await hre.ethers.getSigners())[0];
  const playerAddress = signer.address;

  // TODO: Get corresponding level address
  const levelAddress = deploymentInfo[level];

  // The contract doesn't have a function for checking
  // if a level is completed (geez Ethernaut :eye-roll:).
  // So we have to query for past events.
  const events = await findLevelCompletedEvents(
    ethernaut,
    playerAddress,
    levelAddress
  );

  return events.length > 0;
}
