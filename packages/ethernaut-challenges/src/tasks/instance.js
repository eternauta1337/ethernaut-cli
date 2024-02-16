const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const output = require('common/output');

require('../scopes/oz')
  .task(
    'instance',
    'Creates an instance of a level, so that it can be played. The address of the instance is printed to the console. Use this address to interact with the contract using the ethernaut-cli contract command. Make sure to use the info command to get instructions on how to complete the level.'
  )
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    try {
      const instanceAddress = await createInstance(level, hre);
      return output.resultBox(`Instance created ${instanceAddress}`);
    } catch (err) {
      return output.errorBox(err);
    }
  });

async function createInstance(level, hre) {
  const deploymentInfo = helper.getDeploymentInfo();

  // Prepare the main game contract
  const gameAddress = deploymentInfo.ethernaut;
  const abi = helper.getEthernautAbi();
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

  // Create the level instance
  const idx = parseInt(level) - 1;
  const levelAddress = deploymentInfo[idx];

  const tx = await ethernaut.createLevelInstance(levelAddress);
  const receipt = await tx.wait();
  if (receipt.status !== 1) {
    throw new Error('Instance creation transaction reverted');
  }

  const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log));
  if (events.length === 0) {
    throw new Error('No events emitted during instance creation');
  }

  const createdEvent = events[0];
  const instanceAddress = createdEvent.args[1];

  return instanceAddress;
}
