const output = require('ethernaut-common/src/ui/output')
const confirm = require('ethernaut-common/src/ui/confirm')
const getBalance = require('../internal/get-balance')
const printTxSummary = require('../internal/print-tx-summary')
const mineTx = require('../internal/mine-tx')
const connectSigner = require('../internal/connect-signer')
const types = require('ethernaut-common/src/validation/types')
const {
  getGasData,
  warnHighGasCost,
  warnInsufficientFunds,
} = require('../internal/gas-util')

require('../scopes/interact')
  .task('send', 'Sends ether to an address')
  .addParam(
    'address',
    'The address that will receive the ether',
    undefined,
    types.address,
  )
  .addParam(
    'value',
    'The amount of ether to send with the transaction. Warning! The value is in ether, not wei.',
    undefined,
    types.int,
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

  const gasAmount = 21000n

  const gasData = await getGasData(hre, gasAmount)

  // Gas warnings
  if (!noConfirm) {
    if ((await warnHighGasCost(gasData.costEth)) === false) return
    if ((await warnInsufficientFunds(signer, gasData.costEth, value)) === false)
      return
  }

  // Show a summary of the transaction
  buffer += await printTxSummary({
    signer,
    to: address,
    value,
    gasAmount,
    gasPrice: gasData.priceGwei,
    gasCost: gasData.costEth,
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
