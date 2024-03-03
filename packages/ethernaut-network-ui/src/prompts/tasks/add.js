module.exports = function setup(hre) {
  const add = hre.scopes.network.tasks.add

  add.paramDefinitions.url.prompt = require('../params/url')
}
