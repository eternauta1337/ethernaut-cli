module.exports = function setup(hre) {
  const edit = hre.scopes.network.tasks.edit

  edit.positionalParamDefinitions.find((p) => p.name === 'alias').autocomplete =
    require('../params/alias')('Select a network to edit')
}
