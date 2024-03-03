module.exports = function setup(hre) {
  const remove = hre.scopes.network.tasks.remove

  remove.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    require('../params/alias')('Select a network')
}
