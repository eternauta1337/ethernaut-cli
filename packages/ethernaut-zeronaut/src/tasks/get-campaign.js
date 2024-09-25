const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')
const debug = require('ethernaut-common/src/ui/debug')

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
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      const id = hre.ethers.encodeBytes32String(name)
      const campaign = await contract.getCampaign(id)

      let str = ''
      str += `\n  name: ${hre.ethers.decodeBytes32String(campaign.id)}`
      str += `\n  owner: ${campaign.owner}`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
