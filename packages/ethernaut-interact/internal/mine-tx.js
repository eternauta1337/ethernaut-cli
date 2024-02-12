const spinner = require('common/spinner');
const debug = require('common/debugger');
const output = require('common/output');
const getBalance = require('./get-balance');
const { getFullEventSignature } = require('../internal/signatures');

module.exports = async function mineTx(tx, signer) {
  spinner.progress('Sending transaction', 'interact');

  const receipt = await tx.wait();
  // TODO: Catch wait failure here

  debug.log(JSON.stringify(receipt, null, 2), 'interact-deep');

  output.info(`Transaction mined!`);
  output.info(`Gas used: ${receipt.gasUsed.toString()}`);
  output.info(`Gas price: ${receipt.gasPrice.toString()}`);
  output.info(`Block number: ${receipt.blockNumber}`);
  output.info(`Resulting signer balance: ${await getBalance(signer.address)}`);

  if (receipt.status === 0) {
    spinner.fail('Transaction reverted', 'interact');
    throw new Error(`Transaction mined but execution reverted: ${receipt}`);
  }

  spinner.success('Transaction mined successfully');

  // Display events
  const events = receipt.logs.map((log) => contract.interface.parseLog(log));
  if (events.length > 0) {
    output.info(`Emitted ${events.length} events:`);
    events.forEach((event) => {
      debug.log(event, 'interact-deep');

      const eventAbi = abi.find((item) => item.name === event.name);

      output.info(`${getFullEventSignature(eventAbi, event)}`);
    });
  } else {
    output.info('Emitted no events');
  }
};
