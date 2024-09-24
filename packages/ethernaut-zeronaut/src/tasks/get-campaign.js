const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')
const debug = require('ethernaut-common/src/ui/debug')

require('../scopes/zeronaut')
  .task('get-campaign', 'finds an existing campaign')
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
      str += `\n  levels: ${campaign.levels.length}`

      for (let i = 0; i < campaign.levels.length; i++) {
        const levelAddress = campaign.levels[i]
        const levelName = await contract.getLevelName(levelAddress)
        str += `\n   - Level ${i}: "${hre.ethers.decodeBytes32String(levelName)}"`
      }

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
