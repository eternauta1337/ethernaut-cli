const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const output = require('common/output');

require('../scopes/oz')
  .task(
    'submit',
    'Submits an instance created by the instance task, and later manipulated as required by the level. The instance must be submitted to the games main contract in order to complete the level. Use the info command to get instructions on how to complete the level.'
  )
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'address',
    'The address of the instance to submit',
    undefined,
    types.string
  )
  .setAction(async ({ address }, hre) => {
    try {
      output.result(await submitInstance(address, hre));
    } catch (err) {
      output.problem(err.message);
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

  if (receipt.status === 0) {
    throw new Error('Transaction failed');
  }
  if (receipt.logs.length === 0) {
    throw new Error('No events emitted');
  }

  const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log));

  const completedEvent = events[0];
  const instanceAddress = completedEvent.args[1];
  const levelAddress = completedEvent.args[2];

  return `Level completed ${levelAddress} with instance ${instanceAddress}`;
}
