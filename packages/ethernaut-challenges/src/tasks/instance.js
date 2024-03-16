const types = require('ethernaut-common/src/validation/types')
const helper = require('../internal/helper')
const output = require('ethernaut-common/src/ui/output')
const { getNetworkName } = require('ethernaut-common/src/util/network')
const getEthernautContract = require('../internal/ethernaut-contract')
const spinner = require('ethernaut-common/src/ui/spinner')
const debug = require('ethernaut-common/src/util/debug')

require('../scopes/challenges')
  .task(
    'instance',
    'Creates an instance of a level, so that it can be played. The address of the instance is printed to the console. Use this address to interact with the contract using the ethernaut-cli contract command. Make sure to use the info command to get instructions on how to complete the level.',
  )
  .addPositionalParam('level', 'The level number', undefined, types.int)
  .setAction(async ({ level }, hre) => {
    try {
      const instanceAddress = await createInstance(level, hre)
      return output.resultBox(`Instance created ${instanceAddress}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function createInstance(level, hre) {
  const network = await getNetworkName(hre)
  debug.log(
    `Creating instance for level ${level} on network ${network}`,
    'challenges',
  )

  const ethernaut = await getEthernautContract(hre)

  const levelAddress = helper.getLevelAddress(level, network)

  spinner.progress(`Creating level instance on ${network}...`, 'challenges')

  const tx = await ethernaut.createLevelInstance(levelAddress)
  const receipt = await tx.wait()
  if (receipt.status !== 1) {
    throw new Error('Instance creation transaction reverted')
  }

  spinner.success(
    `Created level instance on ${network} for player ${receipt.from}`,
    'challenges',
  )

  const events = receipt.logs.map((log) => ethernaut.interface.parseLog(log))
  if (events.length === 0) {
    throw new Error('No events emitted during instance creation')
  }

  const createdEvent = events[0]
  const instanceAddress = createdEvent.args[1]

  return instanceAddress
}
