const helper = require('../internal/helper');
const output = require('common/output');
const spinner = require('common/spinner');
const findLevelCompletedEvents = require('../internal/level-completed-logs');

require('../scopes/oz')
  .task(
    'check-all',
    'Checks all levels that have been completed and submitted by the player'
  )
  .setAction(async ({ level }, hre) => {
    try {
      const completed = await checkLevels(hre);
      output.resultBox(completed.map((c, i) => `Level ${i}: ${c}`).join('\n'));
    } catch (err) {
      output.errorBox(err);
    }
  });

async function checkLevels(hre) {
  const deploymentInfo = helper.getDeploymentInfo();

  // Prepare the main game contract
  const gameAddress = deploymentInfo.ethernaut;
  const abi = helper.getEthernautAbi();
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

  // Get player address
  const signer = (await hre.ethers.getSigners())[0];
  const playerAddress = signer.address;

  // The contract doesn't have a function for checking
  // if a level is completed (geez Ethernaut :eye-roll:).
  // So we have to query for past events.
  const events = await findLevelCompletedEvents(
    ethernaut,
    playerAddress,
    undefined
  );

  // Iterate all levels
  const completed = Object.entries(deploymentInfo)
    .map(([key, value]) => {
      // Levels addresses are stored as numeric properties, e.g. deploymentInfo["0"]
      if (isNaN(parseFloat(key))) return;
      const levelAddress = value;
      return events.some((event) => event.args.level === levelAddress);
    })
    .filter((e) => e !== undefined);

  return completed;
}
