module.exports = function setup(hre) {
  const remove = hre.scopes.network.tasks.remove

  remove.positionalParamDefinitions.find(
    (p) => p.name === 'alias',
  ).autocomplete = require('../params/alias')('Select a network')
}
