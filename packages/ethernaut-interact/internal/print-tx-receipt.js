const output = require('common/output');
const debug = require('common/debug');
const { getFullEventSignature } = require('./signatures');

module.exports = async function printTxReceipt(receipt, contract) {
  // Tx info
  output.resultBox('Transaction Receipt', [
    `Tx hash: ${receipt.hash}`,
    `Gas used: ${receipt.gasUsed.toString()}`,
    `Gas price: ${receipt.gasPrice.toString()}`,
    `Block number: ${receipt.blockNumber}`,
  ]);

  // Display events
  if (contract) {
    const events = receipt.logs.map((log) => contract.interface.parseLog(log));
    if (events.length > 0) {
      output.info(`Emitted ${events.length} events:`);
      events.forEach((event, idx) => {
        debug.log(event, 'interact-deep');

        const eventAbi = contract.interface.fragments.find(
          (item) => item.name === event.name
        );

        output.resultBox(
          `Event ${idx + 1}`,
          [getFullEventSignature(eventAbi, event)],
          'round',
          'gray'
        );
      });
    } else {
      output.info('Emitted no events');
    }
  }
};