const output = require('common/output');
const { getFullEventSignature } = require('./signatures');

module.exports = async function printTxReceipt(receipt) {
  // Tx info
  output.resultBox('Transaction Receipt', [
    `Tx hash: ${receipt.hash}`,
    `Gas used: ${receipt.gasUsed.toString()}`,
    `Gas price: ${receipt.gasPrice.toString()}`,
    `Block number: ${receipt.blockNumber}`,
  ]);

  // Display events
  const events = receipt.logs.map((log) => contract.interface.parseLog(log));
  if (events.length > 0) {
    output.info(`Emitted ${events.length} events:`);
    events.forEach((event) => {
      debug.log(event, 'interact-deep');

      const eventAbi = abi.find((item) => item.name === event.name);

      output.resultBox('event', getFullEventSignature(eventAbi, event));
    });
  } else {
    output.info('Emitted no events');
  }
};
