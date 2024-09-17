const { ethers } = require('ethers')
const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/util')
  .task('calldata', 'Decodes calldata of a tx')
  .addPositionalParam(
    'transactionId',
    'The transaction to lookup',
    undefined,
    types.string,
  )
  .addPositionalParam(
    'abi',
    'The ABI of the contract to decode the calldata',
    undefined,
    types.array,
  )
  .setAction(async ({ transactionId, abi }, hre) => {
    try {
      const tx = await hre.ethers.provider.getTransaction(transactionId)

      if (!tx) {
        throw new EthernautCliError('ethernaut-network', 'No tx found.', false)
      }

      const calldata = tx.data
      const iface = new ethers.utils.Interface(abi)
      const decodedData = iface.parseTransaction({ data: calldata })

      const callData = {
        functionName: decodedData.name,
        args: decodedData.args,
      }

      return output.resultBox(callData)
    } catch (err) {
      return output.errorBox(err)
    }
  })
