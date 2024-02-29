const { types } = require('hardhat/config')
const output = require('common/src/output')
const storage = require('../internal/storage')
const { validateVarName } = require('common/src/name')
const { getWallet, generatePk } = require('../internal/signers')

require('../scopes/wallet')
  .task('add', 'Adds a signer to the cli')
  .addOptionalPositionalParam(
    'alias',
    'How the signer will be referenced',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'pk',
    'The private key of the signer. Pass "random" or an empty string to generate a private key.',
    undefined,
    types.string,
  )
  .setAction(async ({ alias, pk }) => {
    try {
      if (!validateVarName(alias)) {
        throw new Error(
          `Invalid alias: ${alias}. The alias must be a valid JavaScript variable name.`,
        )
      }

      const signers = storage.readSigners()

      if (alias in signers) {
        throw new Error(`The signer ${alias} already exists`)
      }

      if (pk === 'random' || pk === '') {
        pk = generatePk(hre)
        output.info('Generated random private key')
      }

      const address = getWallet(pk).address
      if (!address) {
        throw new Error(`Invalid private key: ${pk}`)
      }

      signers[alias] = {
        address,
        pk,
      }

      if (signers.activeSigner === 'none') {
        signers.activeSigner = alias
      }

      storage.storeSigners(signers)

      output.resultBox(`Added signer ${alias} with address ${address}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })
