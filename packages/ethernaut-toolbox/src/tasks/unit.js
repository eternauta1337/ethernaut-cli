const { types } = require('hardhat/config');
const prompt = require('common/src/prompt');
const output = require('common/src/output');
const debug = require('common/src/debug');

const units = ['ether', 'wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney'];

const unit = require('../scopes/util')
  .task(
    'unit',
    `Converts between different units of Ether. E.g. 1 ether is 1000000000000000000 wei. Units can be one of ${units.join(
      ','
    )}.`
  )
  .addOptionalPositionalParam(
    'value',
    'The value to convert',
    undefined,
    types.string
  )
  .addOptionalParam('from', `The unit to convert from`, undefined, types.string)
  .addOptionalParam('to', `The unit to convert to`, undefined, types.string)
  .setAction(async ({ value, from, to }, hre) => {
    try {
      const valueWei = ethers.parseUnits(value, from);
      let result = ethers.formatUnits(valueWei, to);

      const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
      result = result.match(removeTrailingZeroes)[1];

      return output.resultBox(result);
    } catch (err) {
      return output.errorBox(err);
    }
  });

async function autocompleteUnit({ name, description, from, to }) {
  // No need to autocomplete?
  if (name === 'from' && from) return undefined;
  if (name === 'to' && to) return undefined;

  // Choices are all units minus the one used
  let choices = units.concat();
  if (name === 'from' && to) choices = units.filter((unit) => unit !== to);
  if (name === 'to' && from) choices = units.filter((unit) => unit !== from);

  // Show unit list
  return await prompt({
    type: 'autocomplete',
    message: `Enter ${name} (${description})`,
    choices,
  });
}

unit.paramDefinitions['from'].autocomplete = autocompleteUnit;
unit.paramDefinitions['to'].autocomplete = autocompleteUnit;
