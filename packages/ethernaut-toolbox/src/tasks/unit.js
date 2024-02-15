const { types } = require('hardhat/config');
const prompt = require('common/prompt');
const output = require('common/output');
const debug = require('common/debug');

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

async function pickUnit({ name, description, from, to }) {
  let choices = units.concat();
  if (name === 'from' && to) choices = units.filter((unit) => unit !== to);
  if (name === 'to' && from) choices = units.filter((unit) => unit !== from);

  return await prompt({
    type: 'select',
    message: `Select ${name} (${description})`,
    choices,
  });
}

unit.paramDefinitions['from'].prompt = pickUnit;
unit.paramDefinitions['to'].prompt = pickUnit;
