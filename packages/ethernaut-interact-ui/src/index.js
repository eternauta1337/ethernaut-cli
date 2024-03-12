const { extendEnvironment } = require('hardhat/config')

require('ethernaut-ui/src/index')
require('ethernaut-interact/src/index')

const abiSuggest = require('./suggest/abi')
const abiPrompt = require('./prompts/abi')
const addressSuggest = require('./suggest/address')
const fnPrompt = require('./prompts/fn')
const paramsPrompt = require('./prompts/params')
const fnERC20Prompt = require('./prompts/fnERC20')
const paramsERC20Prompt = require('./prompts/paramsERC20')

extendEnvironment((hre) => {
  const contract = hre.scopes.interact.tasks.contract
  contract.paramDefinitions.abi.suggest = abiSuggest
  contract.paramDefinitions.abi.prompt = abiPrompt
  contract.paramDefinitions.address.suggest = addressSuggest
  contract.paramDefinitions.fn.prompt = fnPrompt
  contract.paramDefinitions.params.prompt = paramsPrompt

  const token = hre.scopes.interact.tasks.token
  token.paramDefinitions.address.suggest = addressSuggest
  token.paramDefinitions.fn.prompt = fnERC20Prompt
  token.paramDefinitions.params.prompt = paramsERC20Prompt
})
