const { units } = require('ethernaut-util/src/tasks/unit')
const prompt = require('common/src/prompt')

module.exports = function setup(hre) {
  const unit = hre.scopes.util.tasks.unit

  unit.paramDefinitions['from'].autocomplete = autocompleteUnit
  unit.paramDefinitions['to'].autocomplete = autocompleteUnit
}

async function autocompleteUnit({
  paramName,
  paramDefault,
  description,
  from,
  to,
}) {
  const valueProvided =
    paramName === 'from' ? from !== undefined : to !== undefined
  const isDefault =
    paramName === 'from' ? from === paramDefault : to === paramDefault

  // No need to autocomplete?
  if (valueProvided && !isDefault) return undefined

  // Choices are all units minus the one used
  let choices = units.concat()
  if (paramName === 'from' && to) choices = units.filter((unit) => unit !== to)
  if (paramName === 'to' && from)
    choices = units.filter((unit) => unit !== from)

  // Show unit list
  return await prompt({
    type: 'autocomplete',
    message: `Enter ${paramName} (${description})`,
    choices,
    initial: choices.indexOf(paramDefault),
  })
}