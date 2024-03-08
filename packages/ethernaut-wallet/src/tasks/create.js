const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')
const { validateVarName } = require('ethernaut-common/src/name')
const { getWallet, generatePk } = require('../internal/signers')

const task = require('../scopes/wallet')
  .task('create', 'Creates a new wallet')
  .addPositionalParam(
    'alias',
    'The name of the wallet',
    undefined,
    types.string,
  )
  .addParam(
    'pk',
    'The private key of the wallet or "random". Pass "random" or an empty string to generate a private key.',
    'random',
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
        throw new Error(`The wallet ${alias} already exists`)
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

      output.resultBox(`Created new wallet ${alias} with address ${address}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

task.paramDefinitions.pk.isOptional = false
