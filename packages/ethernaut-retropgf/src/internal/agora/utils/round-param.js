const types = require('ethernaut-common/src/validation/types')

function addRoundParam(task) {
  task.addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be "any" or a number > 0.',
    'latest',
    types.string,
  )
}

module.exports = {
  addRoundParam,
}
