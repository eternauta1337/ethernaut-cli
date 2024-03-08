const output = require('ethernaut-common/src/output')
const confirm = require('ethernaut-common/src/confirm')
const getBalance = require('../internal/get-balance')
const printTxSummary = require('../internal/print-tx-summary')
const mineTx = require('../internal/mine-tx')
const connectSigner = require('../internal/connect-signer')
const { types } = require('hardhat/config')

require('../scopes/interact')
  .task('send', 'Sends ether to an address')
  .addParam(
    'address',
    'The address that will receive the ether',
    undefined,
    types.string,
  )
  .addParam(
    'value',
    'The amount of ether to send with the transaction. Warning! The value is in ether, not wei.',
    undefined,
    types.string,
  )
  .addFlag(
    'noConfirm',
    'Skip confirmation prompts, avoiding any type of interactivity',
  )
  .setAction(async ({ address, value, noConfirm }, hre) => {
    try {
      return await sendEther({ address, value, noConfirm, hre })
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function sendEther({ address, value, noConfirm, hre }) {
  let buffer = ''

  if (!value) value = '0'

  const valueWei = hre.ethers.parseEther(value)

  const signer = await connectSigner(noConfirm)

  // Show a summary of the transaction
  buffer += await printTxSummary({
    signer,
    to: address,
    value,
    description: `Sending ${value} ETH (${valueWei} wei) to ${address}`,
  })

  // Prompt the user for confirmation
  await confirm('Do you want to proceed with the call?', noConfirm)

  // Prepare the tx
  const tx = await signer.sendTransaction({
    to: address,
    value: valueWei,
  })

  buffer += await mineTx(tx)

  buffer += output.info(
    `Resulting balance: ${await getBalance(signer.address)}`,
  )

  return buffer
}
