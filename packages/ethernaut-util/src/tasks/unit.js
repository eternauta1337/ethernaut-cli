const { types } = require('hardhat/config')
const prompt = require('common/src/prompt')
const output = require('common/src/output')

const units = ['ether', 'wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney']

const unit = require('../scopes/util')
  .task(
    'unit',
    `Converts between different units of Ether. E.g. 1 ether is 1000000000000000000 wei. Units can be one of ${units.join(
      ',',
    )}.`,
  )
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .addOptionalParam('from', 'The unit to convert from', 'ether', types.string)
  .addOptionalParam('to', 'The unit to convert to', 'wei', types.string)
  .setAction(async ({ value, from, to }, hre) => {
    try {
      const valueWei = hre.ethers.parseUnits(value, from)
      let result = hre.ethers.formatUnits(valueWei, to)

      const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/
      result = result.match(removeTrailingZeroes)[1]

      return output.resultBox(result)
    } catch (err) {
      return output.errorBox(err)
    }
  })

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

unit.paramDefinitions['from'].autocomplete = autocompleteUnit
unit.paramDefinitions['to'].autocomplete = autocompleteUnit
