const { ethers } = require('ethers')
const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')
const abi = require('../../../ethernaut-interact-ui/src/suggest/abi')

require('../scopes/interact')
  .task(
    'calldata',
    'Decodes calldata of a provided one, or searches for it from a given tx id',
  )
  .addOptionalPositionalParam(
    'calldata',
    'The calldata to decode',
    undefined,
    types.string,
  )
  .addOptionalPositionalParam(
    'transactionId',
    'The transaction to lookup',
    undefined,
    types.bytes32,
  )
  .addPositionalParam(
    'abi',
    'The ABI of the contract to decode the calldata',
    undefined,
    types.array,
  )
  .addPositionalParam(
    'filter',
    'Some text to filter the list of known ABIs. Leave empty to list all. Results will be ordered by similarity to the filter text, so the first result will be the best match.',
    undefined,
    types.string,
  )
  .setAction(async ({ calldata, transactionId }, hre) => {
    try {
      const iface = new ethers.utils.Interface(abi)

      if (calldata) {
        const decodedData = iface.parseTransaction({ data: calldata })
        return output.resultBox({
          functionName: decodedData.name,
          args: decodedData.args,
        })
      }

      if (transactionId) {
        const tx = await hre.ethers.provider.getTransaction(transactionId)
        if (!tx)
          throw new EthernautCliError(
            'ethernaut-network',
            'No tx found.',
            false,
          )
        const decodedData = iface.parseTransaction({ data: tx.data })
        return output.resultBox({
          functionName: decodedData.name,
          args: decodedData.args,
        })
      }

      throw new EthernautCliError(
        'ethernaut-interact',
        'Either transactionId or calldata must be provided',
        false,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
