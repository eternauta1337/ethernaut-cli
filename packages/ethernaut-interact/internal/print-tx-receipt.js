const output = require('common/output');
const debug = require('common/debug');
const { getFullEventSignature } = require('./signatures');

module.exports = async function printTxReceipt(receipt, contract) {
  // Tx info
  output.resultBox(
    `Tx hash: ${receipt.hash}\n` +
      `Gas used: ${receipt.gasUsed.toString()}\n` +
      `Gas price: ${receipt.gasPrice.toString()}\n` +
      `Block number: ${receipt.blockNumber}`,
    'Transaction Receipt'
  );

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
          getFullEventSignature(eventAbi, event),
          `Event ${idx + 1}`
        );
      });
    } else {
      output.info('Emitted no events');
    }
  }
};
