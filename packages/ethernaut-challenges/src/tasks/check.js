const types = require('ethernaut-common/src/validation/types')
const helper = require('../internal/helper')
const output = require('ethernaut-common/src/ui/output')
const findLevelCompletedEvents = require('../internal/level-completed-logs')
const { getNetworkName } = require('ethernaut-common/src/util/network')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/challenges')
  .task(
    'check',
    'Checks if the player has completed the specified level by submitting an instance modified as per the levels requirements',
  )
  .addPositionalParam('level', 'The level number', undefined, types.int)
  .setAction(async ({ level }, hre) => {
    try {
      const completed = await checkLevel(level, hre)
      if (completed) return output.resultBox('Level completed')
      else return output.warnBox('Level not completed')
    } catch (err) {
      output.errorBox(err)
    }
  })

async function checkLevel(level, hre) {
  if (level < 1) {
    throw new EthernautCliError('ethernaut-challenges', 'Invalid level number')
  }

  const network = await getNetworkName(hre)
  const deploymentInfo = helper.getDeploymentInfo(network)

  // Prepare the main game contract
  const gameAddress = deploymentInfo.ethernaut
  const abi = helper.getEthernautAbi()
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress)

  // Get player address
  const signer = (await hre.ethers.getSigners())[0]
  const playerAddress = signer.address

  const idx = parseInt(level) - 1
  const levelAddress = deploymentInfo[idx]

  // The contract doesn't have a function for checking
  // if a level is completed (geez Ethernaut :eye-roll:).
  // So we have to query for past events.
  const events = await findLevelCompletedEvents(
    ethernaut,
    playerAddress,
    levelAddress,
  )

  return events.length > 0
}
