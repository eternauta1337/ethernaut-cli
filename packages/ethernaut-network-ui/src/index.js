const { extendEnvironment } = require('hardhat/config')

const promptUrl = require('./prompts/url')
const promptAlias = require('./prompts/alias')
const promptFork = require('./prompts/fork')

require('ethernaut-ui/src/index')
require('ethernaut-network/src/index')

extendEnvironment((hre) => {
  const add = hre.scopes.network.tasks.add
  add.paramDefinitions.url.prompt = promptUrl

  const activate = hre.scopes.network.tasks.activate
  activate.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a network to activate')

  const edit = hre.scopes.network.tasks.edit
  edit.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a network to edit')

  const remove = hre.scopes.network.tasks.remove
  remove.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a network')

  const node = hre.scopes.network.tasks.node
  node.paramDefinitions.fork.prompt = promptFork

  const info = hre.scopes.network.tasks.info
  info.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    promptAlias('Select a network')
})
