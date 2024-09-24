const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')

require('../scopes/zeronaut')
  .task('create-level', 'Adds a level to a campaign')
  .addPositionalParam(
    'level',
    'The address of the level',
    undefined,
    types.address,
  )
  .addPositionalParam(
    'campaign',
    'The name of the campaign',
    undefined,
    types.string,
  )
  .setAction(async ({ campaign, level }, hre) => {
    try {
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      const id = hre.ethers.encodeBytes32String(campaign)
      const tx = await contract.createLevel(id, level)
      await tx.wait()

      return output.resultBox(`Added level ${level} to campaign ${campaign}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
