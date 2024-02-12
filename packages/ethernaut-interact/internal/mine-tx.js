const spinner = require('common/spinner');
const debug = require('common/debug');
const printTxReceipt = require('./print-tx-receipt');

module.exports = async function mineTx(tx) {
  spinner.progress('Sending transaction', 'interact');

  const receipt = await tx.wait();
  // TODO: Catch wait failure here

  debug.log(JSON.stringify(receipt, null, 2), 'interact-deep');

  if (receipt.status === 0) {
    spinner.fail('Transaction reverted', 'interact');
    throw new Error(`Transaction mined but execution reverted: ${receipt}`);
  }

  spinner.success('Transaction mined successfully');

  await printTxReceipt(receipt);
};
