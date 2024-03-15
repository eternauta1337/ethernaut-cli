const output = require('ethernaut-common/src/output')
const types = require('ethernaut-common/src/types')
const { getChainId } = require('ethernaut-common/src/network')
const {
  EtherscanApi,
  getEtherscanUrl,
} = require('ethernaut-interact/src/internal/etherscan')
const { checkEnvVar } = require('ethernaut-common/src/check-env')

require('../scopes/interact')
  .task(
    'info',
    'Retrieves information about a contract address using Etherscan, such as the contract name, ABI, and source code. Note: Additional contract metadata like the public label of an address requires a pro account, and is currently not implemented.',
  )
  .addPositionalParam(
    'address',
    'The address of the contract to get information about',
    undefined,
    types.address,
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

      let report = ''

      if (info.Implementation) {
        strs.push(`Implementation: ${info.Implementation}`)
      }

      if (abi && info.ABI) {
        report += output.infoBox(JSON.stringify(info.ABI, null, 2), 'ABI')
      }

      if (source && info.SourceCode) {
        // Not sure why the source code looks so broken
        // inside a box, so showing it raw...
        console.log(info.SourceCode)
        report += info.SourceCode
      }

      report += output.resultBox(strs.join('\n'))

      return report
    } catch (err) {
      return output.errorBox(err)
    }
  })
