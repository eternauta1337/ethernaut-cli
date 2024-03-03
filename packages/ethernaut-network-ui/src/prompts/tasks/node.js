module.exports = function setup(hre) {
  const node = hre.scopes.network.tasks.node

  node.paramDefinitions.fork.prompt = require('../params/fork')
}
