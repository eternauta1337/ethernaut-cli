const getBalance = require('./get-balance')
const output = require('ethernaut-common/src/ui/output')

module.exports = async function printTxSummary({
  signer,
  to,
  value,
  description,
  gasAmount,
  gasPrice,
  gasCost,
}) {
  return output.warnBox(
    `${description}\n\n` +
      `Signer: ${signer.address}\n` +
      `Balance: ${await getBalance(signer.address)} ETH\n` +
      `To: ${to}\n` +
      `Value: ${value} ETH\n` +
      `Gas amount: ${gasAmount}\n` +
      `Gas price: ${gasPrice} gwei\n` +
      `Gas cost: ${gasCost} ETH\n` +
      'Pending Tx',
  )
}
