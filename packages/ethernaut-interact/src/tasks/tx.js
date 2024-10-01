const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const EthernautCliError = require('ethernaut-common/src/error/error')
const loadAbi = require('../internal/load-abi')

require('../scopes/interact')
  .task('tx', 'Gives information about a mined transaction')
  .addPositionalParam(
    'transactionId',
    'The transaction to lookup',
    undefined,
    types.bytes32,
  )
  .addPositionalParam(
    'abi',
    'The ABI path of the file to decode the tx',
    undefined,
    types.string,
  )
  .setAction(async ({ transactionId, abi }, hre) => {
    try {
      const _abi = loadAbi(abi)
      const iface = new hre.ethers.Interface(_abi)
      const tx = await hre.ethers.provider.getTransaction(transactionId)
      if (!tx)
        throw new EthernautCliError('ethernaut-interact', 'No tx found.', false)
      const decodedData = iface.parseTransaction({ data: tx.data })

      // console.log(decodedData)

      const str = `
      functionName:
        ${decodedData.name},
        args:
        (${decodedData.args.join(', ')})
            `

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
