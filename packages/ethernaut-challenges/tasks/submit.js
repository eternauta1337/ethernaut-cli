const { types } = require('hardhat/config');
const helper = require('../internal/helper');
const logger = require('common/logger');

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
    const deploymentInfo = helper.getDeploymentInfo();

    // Prepare the main game contract
    const gameAddress = deploymentInfo.ethernaut;
    const abi = helper.getEthernautAbi();
    const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

    // Submit the instance
    try {
      const tx = await ethernaut.submitLevelInstance(address);
      const receipt = await tx.wait();
      const events = receipt.logs.map((log) =>
        ethernaut.interface.parseLog(log)
      );
      logger.debug(receipt, events);

      // Check completion
      if (events.length === 0) {
        logger.output('Level not completed');
      } else {
        const completedEvent = events[0];
        const instanceAddress = completedEvent.args[1];
        const levelAddress = completedEvent.args[2];
        logger.output(
          `Level completed ${levelAddress} with instance ${instanceAddress}`
        );
      }
    } catch (err) {
      logger.error(err.message);
    }
  });
