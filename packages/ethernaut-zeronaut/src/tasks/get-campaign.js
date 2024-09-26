const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect, getLevelContract } = require('../internal/connect')

require('../scopes/zeronaut')
  .task('get-campaign', 'Retrieves details for a campaign')
  .addPositionalParam(
    'name',
    'The name of the campaign',
    undefined,
    types.string,
  )
  .setAction(async ({ name }, hre) => {
    try {
      // Connect to the game contract
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      // Get the campaign details
      const id = hre.ethers.encodeBytes32String(name)
      const campaign = await contract.getCampaign(id)

      // Get the player address
      const signer = (await hre.ethers.getSigners())[0]
      const playerAddress = signer.address

      // Print general campaign details
      let str = ''
      str += `  name: ${hre.ethers.decodeBytes32String(campaign.id)}`
      str += `\n  owner: ${campaign.owner}`
      str += `\n  levels: ${campaign.levels.length}`

      // Get each level's details
      for (let i = 0; i < campaign.levels.length; i++) {
        const levelId = campaign.levels[i]
        const solved = await contract.isLevelSolved(levelId, playerAddress)
        const levelName = hre.ethers.decodeBytes32String(levelId)
        str += `\n    [${i + 1}] "${levelName}" ${solved ? '✅' : ''}`
      }

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
