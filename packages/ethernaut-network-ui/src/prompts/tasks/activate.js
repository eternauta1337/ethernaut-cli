module.exports = function setup(hre) {
  const activate = hre.scopes.network.tasks.activate

  activate.positionalParamDefinitions.find((p) => p.name === 'alias').prompt =
    require('../params/alias')('Select a network to activate')
}
