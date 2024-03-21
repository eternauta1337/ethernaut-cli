const output = require('ethernaut-common/src/ui/output')

require('../scopes/util')
  .task('gas', 'Fetch gas info on the current network')
  .setAction(async (_, hre) => {
    try {
      const feeData = await hre.ethers.provider.getFeeData()
      const priceGwei = hre.ethers.formatUnits(feeData.maxFeePerGas, 'gwei')

      let str = ''
      str += `Gas price: ${priceGwei} gwei`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
