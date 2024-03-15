const output = require('ethernaut-common/src/output')
const { getChainId } = require('ethernaut-common/src/network')
const {
  EtherscanApi,
  getEtherscanUrl,
} = require('ethernaut-interact/src/internal/etherscan')
const { checkEnvVar } = require('ethernaut-common/src/check-env')

require('../scopes/interact')
  .task('info', 'Find information about a contract address using Etherscan')
  .addPositionalParam(
    'address',
    'The address of the contract to get information about',
  )
  .addFlag('abi', 'Show the ABI of the contract')
  .addFlag('source', 'Show the source of the contract')
  .setAction(async ({ address, abi, source }, hre) => {
    try {
      await checkEnvVar(
        'ETHERSCAN_API_KEY',
        'This key is required to fetch contract information from Etherscan',
      )

      const chainId = await getChainId(hre)
      const etherscanUrl = getEtherscanUrl(chainId)
      if (!etherscanUrl) {
        return output.errorBox(
          `Etherscan not supported on chain with id ${chainId}`,
        )
      }

      const etherscan = new EtherscanApi(
        process.env.ETHERSCAN_API_KEY,
        etherscanUrl,
      )

      const info = await etherscan.getContractCode(address)

      if (!info) {
        throw new Error('Contract not found')
      }

      let strs = []
      strs.push(`Contract: ${info.ContractName}`)
      strs.push(`Address: ${address}`)
      strs.push(`Implementation: ${info.Implementation}`)

      if (abi) {
        strs.push(`ABI: ${JSON.stringify(info.ABI, null, 2)}`)
      }

      if (source) {
        strs.push(`Source: ${info.SourceCode}`)
      }

      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
