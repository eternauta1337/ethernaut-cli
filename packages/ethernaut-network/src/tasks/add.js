const { types } = require('hardhat/config')
const output = require('common/src/output')
const fs = require('fs')
const stringify = require('javascript-stringify').stringify
const autocompleteName = require('./add/autocomplete/name')
const autocompleteProvider = require('./add/autocomplete/provider')

const add = require('../scopes/net')
  .task('add', 'Adds a network to the cli')
  .addOptionalParam(
    'alias',
    'How the network will be referenced from the cli',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'name',
    'The actual name of the underlying network',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'provider',
    'The url of the network provider, e.g. https://ethereum-rpc.publicnode.com. Note: Environment variables may be included, e.g. https://eth-mainnet.alchemyapi.io/v2/${INFURA_API_KEY}. Make sure to specify these in your .env file.',
    undefined,
    types.string,
  )
  .setAction(async ({ alias, name, provider }, hre) => {
    try {
      if (alias in hre.userConfig.networks) {
        throw new Error(`Network ${alias} already exists`)
      }

      const newConfig = JSON.parse(JSON.stringify(hre.userConfig))
      if (!newConfig.networks) {
        newConfig.networks = {}
      }

      newConfig.networks[alias] = {
        name,
        url: provider,
      }

      saveConfig(newConfig, hre)

      output.resultBox(`Added network ${alias}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

function saveConfig(newConfig, hre) {
  const filePath = hre.config.paths.configFile
  let fileContent = fs.readFileSync(filePath, 'utf-8')

  // Find the module.exports part of the file
  let regex = /(module\.exports = [\s\S]*)/
  if (!regex.test(fileContent)) {
    throw new Error('Could not find the module.exports object in the file.')
  }

  // Rebuild the file with the new exports object
  const newModuleExports = `module.exports = ${stringify(newConfig, null, 2)}`
  fileContent = fileContent.replace(regex, newModuleExports)

  fs.writeFileSync(filePath, fileContent)
}

add.paramDefinitions.name.autocomplete = autocompleteName
add.paramDefinitions.provider.autocomplete = autocompleteProvider
