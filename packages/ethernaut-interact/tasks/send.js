const output = require('common/output');
const debug = require('common/debugger');
const spinner = require('common/spinner');
const prompt = require('common/prompt');
const getBalance = require('../internal/get-balance');
const warnWithPrompt = require('../internal/warn-prompt');
const mineTx = require('../internal/mine-tx');

require('../scopes/interact')
  .task('send', 'Sends ether to a contract')
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
      output.problem(err.message);
    }
  });

async function sendEther({ address, value, noConfirm, hre }) {
  if (!value) value = '0';

  // Value wei to ether
  const valueWei = hre.ethers.parseEther(value);

  // Id signer
  spinner.progress('Connecting signer', 'interact');
  const signer = (await hre.ethers.getSigners())[0];
  const balance = await getBalance(signer.address);
  output.info(`Using signer: ${signer.address} (${balance} ETH)`);
  spinner.success('Connected signer', 'interact');
  if (balance <= 0 && !noConfirm) {
    await warnWithPrompt(
      'WARNING! Signer balance is 0. You may not be able to send transactions.'
    );
  }

  // Prompt the user for confirmation
  output.info(`Sending ${value} ETH (${valueWei} wei) to ${address}`);
  if (!noConfirm) {
    const response = await prompt({
      type: 'confirm',
      message: 'Do you want to proceed with the call?',
    });
    if (!response) return;
  }

  // Prepare the tx
  const tx = await signer.sendTransaction({
    to: address,
    value: valueWei,
  });

  await mineTx(tx, signer);
}
