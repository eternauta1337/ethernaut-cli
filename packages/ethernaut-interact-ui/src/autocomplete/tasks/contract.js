module.exports = function setup(hre) {
  const contract = hre.scopes.interact.tasks.contract

  contract.paramDefinitions.abi.autocomplete = require('../params/abi')
  contract.paramDefinitions.address.autocomplete = require('../params/address')
  contract.paramDefinitions.fn.autocomplete = require('../params/fn')
  contract.paramDefinitions.params.autocomplete = require('../params/params')
  contract.paramDefinitions.value.autocomplete = require('../params/value')
}
