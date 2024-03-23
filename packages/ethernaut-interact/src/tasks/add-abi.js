const fs = require('fs-extra')
const path = require('path')
const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/interact')
  .task('add-abi', 'Add an ABI to the list of known ABI paths')
  .addPositionalParam(
    'abiPath',
    'The absolute of the ABI (the file will be copied to .ethernaut/interact/abis)',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'name',
    'The file name to use when storing it under .ethernaut/interact/abis. Leave undefined to use the original file name.',
    undefined,
    types.string,
  )
  .setAction(async ({ abiPath, name }) => {
    output.info(`Adding ${abiPath} to the list of known ABIs...`)
    try {
      if (path.extname(abiPath) !== '.json') {
        throw new EthernautCliError(
          'ethernaut-interact',
          `Invalid JSON file: "${abiPath}"`,
        )
      }

      if (!fs.existsSync(abiPath)) {
        throw new EthernautCliError(
          'ethernaut-interact',
          `No file at ${abiPath}`,
        )
      }

      let filename = name || path.basename(abiPath)
      filename = filename.split('.')[0] // Remove extension
      const basePath = storage.getAbisFilePath()
      const targetPath = path.resolve(basePath, `${filename}.json`)

      let abis = storage.readAbiFiles().map((p) => p.path)
      if (abis.includes(targetPath)) {
        throw new EthernautCliError(
          'ethernaut-interact',
          `${targetPath} already exists. Try specifying a different name?`,
        )
      }

      fs.copySync(abiPath, targetPath)

      if (!fs.existsSync(targetPath)) {
        throw new EthernautCliError(
          'ethernaut-interact',
          `There was an error while copying the file to ${targetPath}`,
        )
      }

      return output.resultBox(
        `${filename} added to the list of known ABIs at ${basePath}`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
