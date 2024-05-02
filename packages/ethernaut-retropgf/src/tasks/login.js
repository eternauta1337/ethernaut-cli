const Agora = require('../internal/agora/Agora')
const output = require('ethernaut-common/src/ui/output')
const { createSiweMessage } = require('../internal/Siwe')
const { EthernautCliError } = require('ethernaut-common/src/error/error')

require('../scopes/retro')
  .task(
    'login',
    'Logs in to the Agora RetroPGF API with SIWE (Sign in with Ethereum)',
  )
  .setAction(async (_, hre) => {
    try {
      const signers = await hre.ethers.getSigners()
      if (signers.length === 0) {
        throw new EthernautCliError(
          'ethernaut-retropgf',
          'No signers available - If you are using the ethernaut-cli, please add one with `ethernaut wallet create`',
        )
      }
      const signer = signers[0]
      output.info(
        `Logging in with address: ${signer.address}`,
        'ethernaut-retropgf',
      )

      const statement = 'Log in to Agoras RetroPGF API with SIWE.'
      const message = createSiweMessage(signer.address, statement)
      const signature = await signer.signMessage(message)

      const agora = new Agora()
      await agora.auth.verify({
        message,
        signature,
      })
      const nonce = await agora.auth.nonce()
      output.info(`Nonce: ${nonce}`, 'ethernaut-retropgf')

      // TODO
      return output.resultBox(
        `Logged in with address: ${signer.address} (session nonce: ${nonce})`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
