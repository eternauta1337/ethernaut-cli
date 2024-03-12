const spinner = require('ethernaut-common/src/spinner')
const warnWithPrompt = require('../internal/warn-prompt')
const getBalance = require('../internal/get-balance')
const debug = require('ethernaut-common/src/debug')

module.exports = async function connectSigner(noConfirm) {
  spinner.progress('Connecting signer', 'interact')

  const signers = await hre.ethers.getSigners()
  if (signers.length === 0) {
    throw new Error(
      'No signers available - If you are using the ethernaut-cli, please add one with `ethernaut wallet create`',
    )
  }

  debug.log(`Signers: ${signers.map((s) => s.address).join(', ')}`, 'interact')

  const signer = signers[0]
  const balance = await getBalance(signer.address)

  spinner.success(
    `Connected signer ${signer.address} (${balance} ETH)`,
    'interact',
  )

  if (balance <= 0 && !noConfirm) {
    await warnWithPrompt(
      'WARNING! Signer balance is 0. You may not be able to send transactions.',
    )
  }

  return signer
}
