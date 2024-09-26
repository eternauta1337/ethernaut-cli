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
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      const id = hre.ethers.encodeBytes32String(name)
      const campaign = await contract.getCampaign(id)

      let str = ''
      str += `  name: ${hre.ethers.decodeBytes32String(campaign.id)}`
      str += `\n  owner: ${campaign.owner}`
      str += `\n  levels: ${campaign.levels.length}`

      for (let i = 0; i < campaign.levels.length; i++) {
        const levelId = campaign.levels[i]
        const levelData = await contract.getLevel(levelId)
        const levelAddress = levelData.addr
        const level = await getLevelContract(hre, levelAddress)
        const levelName = hre.ethers.decodeBytes32String(await level.name())
        str += `\n    [${i + 1}] "${levelName}"`
      }

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
