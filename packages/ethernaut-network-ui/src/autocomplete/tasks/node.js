module.exports = function setup(hre) {
  const node = hre.scopes.network.tasks.node

  node.paramDefinitions.fork.autocomplete = require('../params/fork')
}
