const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const output = require('common/output');
const debug = require('common/debug');

require('../scopes/oz')
  .task(
    'submit',
    'Submits an instance created by the instance task, and later manipulated as required by the level. The instance must be submitted to the games main contract in order to complete the level. Use the info command to get instructions on how to complete the level.'
  )
  .addOptionalPositionalParam(
    'address',
    'The address of the instance to submit',
    undefined,
    types.string
  )
  .setAction(async ({ address }, hre) => {
    try {
      return output.resultBox(await submitInstance(address, hre));
    } catch (err) {
      return output.errorBox(err);
    }
  });

async function submitInstance(address, hre) {
  const deploymentInfo = helper.getDeploymentInfo();

  // Prepare the main game contract
  // TODO: This could be a package util
  const gameAddress = deploymentInfo.ethernaut;
  const abi = helper.getEthernautAbi();
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

  // Submit the instance
  const tx = await ethernaut.submitLevelInstance(address);
  const receipt = await tx.wait();
  debug.log(JSON.stringify(receipt, null, 2), 'interact');

  if (receipt.status === 0) {
    throw new Error('Level not completed: Submission transaction failed');
  }
  if (receipt.logs.length === 0) {
    throw new Error('Level not completed: No events emitted upon submission');
  }

  const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log));

  const completedEvent = events[0];
  const instanceAddress = completedEvent.args[1];
  const levelAddress = completedEvent.args[2];

  return `Level completed ${levelAddress} with instance ${instanceAddress}`;
}
