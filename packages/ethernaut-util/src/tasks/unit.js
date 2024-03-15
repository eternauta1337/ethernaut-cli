const types = require('ethernaut-common/src/types')
const output = require('ethernaut-common/src/output')

const units = ['ether', 'wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney']

const task = require('../scopes/util')
  .task(
    'unit',
    `Converts between different units of Ether. E.g. 1 ether is 1000000000000000000 wei. Units can be a number, or one of ${units.join(
      ',',
    )}.`,
  )
  .addPositionalParam('value', 'The value to convert', undefined, types.string)
  .addParam('from', 'The unit to convert from', 'ether', types.string)
  .addParam('to', 'The unit to convert to', 'wei', types.string)
  .setAction(async ({ value, from, to }, hre) => {
    try {
      if (!isNaN(from)) from = Number(from)
      if (!isNaN(to)) to = Number(to)

      const valueWei = hre.ethers.parseUnits(value, from)
      let result = hre.ethers.formatUnits(valueWei, to)

      const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/
      result = result.match(removeTrailingZeroes)[1]

      return output.resultBox(result)
    } catch (err) {
      return output.errorBox(err)
    }
  })

task.paramDefinitions.from.isOptional = false
task.paramDefinitions.to.isOptional = false

module.exports = {
  units,
}
