const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const debug = require('ethernaut-common/src/debug')
const getEthernautContract = require('../internal/ethernaut-contract')

require('../scopes/challenges')
  .task(
    'submit',
    'Submits an instance created by the instance task, and later manipulated as required by the level. The instance must be submitted to the games main contract in order to complete the level. Use the info command to get instructions on how to complete the level.',
  )
  .addPositionalParam(
    'address',
    'The address of the instance to submit',
    undefined,
    types.string,
  )
  .setAction(async ({ address }, hre) => {
    try {
      return output.resultBox(await submitInstance(address, hre))
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function submitInstance(address, hre) {
  const ethernaut = await getEthernautContract(hre)

  // Submit the instance
  const tx = await ethernaut.submitLevelInstance(address)
  const receipt = await tx.wait()
  debug.log(JSON.stringify(receipt, null, 2), 'interact')

  if (receipt.status === 0) {
    throw new Error('Level not completed: Submission transaction failed')
  }
  if (receipt.logs.length === 0) {
    throw new Error('Level not completed: No events emitted upon submission')
  }

  const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log))

  const completedEvent = events.find(
    (event) => event?.name === 'LevelCompletedLog',
  )

  const instanceAddress = completedEvent.args[1]
  const levelAddress = completedEvent.args[2]

  return `Level completed ${levelAddress} with instance ${instanceAddress}`
}
