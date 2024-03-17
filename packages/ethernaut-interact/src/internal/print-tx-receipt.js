const output = require('ethernaut-common/src/ui/output')
const debug = require('ethernaut-common/src/ui/debug')
const { getFullEventSignature } = require('./signatures')
const ethers = require('ethers')

module.exports = async function printTxReceipt(receipt, contract) {
  let buffer = ''

  debug.log(JSON.stringify(receipt, null, 2), 'interact-deep')

  const gasCost = ethers.formatEther(receipt.gasUsed * receipt.gasPrice)
  const gasPriceGwei = ethers.formatUnits(receipt.gasPrice, 'gwei')

  // Tx info
  buffer += output.resultBox(
    `Tx hash: ${receipt.hash}\n` +
      `Gas used: ${receipt.gasUsed.toString()}\n` +
      `Gas price: ${gasPriceGwei} gwei\n` +
      `Gas cost: ${gasCost} ETH\n` +
      `Block number: ${receipt.blockNumber}`,
    'Transaction Receipt',
  )

  // Display events
  if (contract) {
    const events = receipt.logs.map((log) => contract.interface.parseLog(log))
    if (events.length > 0) {
      buffer += output.info(`Emitted ${events.length} events:`)
      events.forEach((event, idx) => {
        debug.log(event, 'interact-deep')

        const eventAbi = contract.interface.fragments.find(
          (item) => item.name === event.name,
        )

        buffer += output.resultBox(
          getFullEventSignature(eventAbi, event),
          `Event ${idx + 1}`,
        )
      })
    } else {
      buffer += output.info('Emitted no events')
    }
  }

  return buffer
}
