const spinner = require('ethernaut-common/src/ui/spinner')
const debug = require('ethernaut-common/src/ui/debug')
const printTxReceipt = require('./print-tx-receipt')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = async function mineTx(tx, contract) {
  spinner.progress('Mining transaction', 'interact')

  const receipt = await tx.wait().catch((err) => {
    throw new EthernautCliError(
      'ethernaut-interact',
      `Transaction failed: ${err}`,
    )
  })

  debug.log(JSON.stringify(receipt, null, 2), 'interact-deep')

  if (receipt.status === 0) {
    spinner.fail('Transaction reverted', 'interact')
    throw new EthernautCliError(
      'ethernaut-interact',
      `Transaction mined but execution reverted: ${receipt}`,
    )
  }

  spinner.success('Transaction mined successfully', 'interact')

  return await printTxReceipt(receipt, contract)
}
