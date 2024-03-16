const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const { validateVarName } = require('ethernaut-common/src/util/name')
const { addSigner, generatePk } = require('../internal/signers')

const task = require('../scopes/wallet')
  .task('add', 'Adds a wallet')
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
    types.bytes32,
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

      const address = addSigner(hre, alias, pk)

      return output.resultBox(
        `Created new wallet ${alias} with address ${address}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })

task.paramDefinitions.pk.isOptional = false
