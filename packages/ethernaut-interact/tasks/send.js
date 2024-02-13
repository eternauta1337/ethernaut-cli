const output = require('common/output');
const debug = require('common/debug');
const confirm = require('common/confirm');
const getBalance = require('../internal/get-balance');
const printTxSummary = require('../internal/print-tx-summary');
const mineTx = require('../internal/mine-tx');
const connectSigner = require('../internal/connect-signer');

require('../scopes/interact')
  .task('send', 'Sends ether to an address')
  .addOptionalParam(
    'address',
    'The address that will receive the ether',
    undefined,
    types.string
  )
  .addOptionalParam(
    'value',
    'The amount of ether to send with the transaction. Warning! The value is in ether, not wei.',
    undefined,
    types.string
  )
  .addOptionalParam(
    'noConfirm',
    'Skip confirmation prompts, avoiding any type of interactivity',
    false,
    types.boolean
  )
  .setAction(async ({ address, value, noConfirm }, hre) => {
    try {
      await sendEther({ address, value, noConfirm, hre });
    } catch (err) {
      debug.log(err, 'interact');
      output.errorBox(err);
    }
  });

async function sendEther({ address, value, noConfirm, hre }) {
  if (!value) value = '0';

  const valueWei = hre.ethers.parseEther(value);

  const signer = await connectSigner(noConfirm);

  // Show a summary of the transaction
  await printTxSummary({
    signer,
    to: address,
    value,
    description: `Sending ${value} ETH (${valueWei} wei) to ${address}`,
  });

  // Prompt the user for confirmation
  await confirm('Do you want to proceed with the call?', noConfirm);

  // Prepare the tx
  const tx = await signer.sendTransaction({
    to: address,
    value: valueWei,
  });

  await mineTx(tx);

  output.info(`Resulting balance: ${await getBalance(signer.address)}`);
}
