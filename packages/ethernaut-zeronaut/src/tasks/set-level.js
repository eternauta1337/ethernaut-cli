const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')

require('../scopes/zeronaut')
  .task('set-level', 'Assigns a level to a campaign')
  .addPositionalParam(
    'campaign',
    'The name of the campaign',
    undefined,
    types.string,
  )
  .addPositionalParam('name', 'The name of the level', undefined, types.string)
  .addPositionalParam(
    'address',
    'The address of the level',
    undefined,
    types.address,
  )
  .setAction(async ({ campaign, name, address }, hre) => {
    try {
      // Connect to the game contract
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      // Set the level for the campaign
      const campaignId = hre.ethers.encodeBytes32String(campaign)
      const levelId = hre.ethers.encodeBytes32String(name)
      const tx = await contract.setLevel(campaignId, levelId, address)
      await tx.wait()

      return output.resultBox(`Added level ${name} to campaign ${campaign}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
