module.exports = function setup(hre) {
  const contract = hre.scopes.interact.tasks.contract

  contract.paramDefinitions.abi.prompt = require('../params/abi')
  contract.paramDefinitions.address.prompt = require('../params/address')
  contract.paramDefinitions.fn.prompt = require('../params/fn')
  contract.paramDefinitions.params.prompt = require('../params/params')
  contract.paramDefinitions.value.prompt = require('../params/value')
}
