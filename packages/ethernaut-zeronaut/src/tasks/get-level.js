const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')

require('../scopes/zeronaut')
  .task('get-level', 'finds an existing campaign')
  .addPositionalParam(
    'name',
    'The name of the campaign',
    undefined,
    types.string,
  )
  .addPositionalParam(
    'level',
    'The index of level to get',
    undefined,
    types.string,
  )
  .setAction(async ({ name, level }, hre) => {
    try {
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      const id = hre.ethers.encodeBytes32String(name)
      const campaign = await contract.getCampaign(id)

      const levelAddress = campaign.levels[level]
      const levelName = await contract.getLevelName(levelAddress)
      const levelInstructions =
        await contract.getLevelInstructions(levelAddress)

      let str = ''
      str += `  name: ${hre.ethers.decodeBytes32String(levelName)}`
      str += `\n  instructions: ${levelInstructions}`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
