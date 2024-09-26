const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect, getLevelContract } = require('../internal/connect')

require('../scopes/zeronaut')
  .task('get-level', 'Retrieves details for a level')
  .addPositionalParam(
    'name',
    'The name of the level to get',
    undefined,
    types.string,
  )
  .setAction(async ({ name }, hre) => {
    try {
      // Connect to the game contract
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      // Get the player address
      const signer = (await hre.ethers.getSigners())[0]
      const playerAddress = signer.address

      // Retrieve the level address
      const id = hre.ethers.encodeBytes32String(name)
      const levelData = await contract.getLevel(id)
      const levelAddress = levelData.addr

      // Connect to the level contract
      const level = await getLevelContract(hre, levelAddress)

      // Query the level details
      const levelName = await level.name()
      const levelInstructions = await level.instructions()

      // Check if the level is completed
      const solved = await contract.isLevelSolved(id, playerAddress)

      // Display the level details
      let str = ''
      str += `  name: ${hre.ethers.decodeBytes32String(levelName)}`
      str += `\n  solved: ${solved}`
      str += `\n  instructions: ${levelInstructions}`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
