module.exports = function setup(hre) {
  const add = hre.scopes.network.tasks.add

  add.paramDefinitions.url.autocomplete = require('../params/url')
}
