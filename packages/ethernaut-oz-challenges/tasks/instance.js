const { types } = require('hardhat/config');
const oz = require('../scopes/oz');
const helper = require('../internal/oz');

oz.task(
  'instance',
  'Creates an instance of a level, so that it can be played. The address of the instance is printed to the console.'
)
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string
  )
  .setAction(async ({ level }, hre) => {
    const deploymentInfo = helper.getDeploymentInfo();

    // Prepare the main game contract
    const gameAddress = deploymentInfo.ethernaut;
    const abi = helper.getEthernautAbi();
    const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

    // Create the level instance
    const levelAddress = deploymentInfo[level];
    const tx = await ethernaut.createLevelInstance(levelAddress);
    const receipt = await tx.wait();
    const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log));
    const createdEvent = events[0];
    const instanceAddress = createdEvent.args[1];
    console.log(`Instance created ${instanceAddress}`);
  });
