const { types } = require('hardhat/config');
const { Select } = require('enquirer');
const logger = require('common/logger');

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
    const valueWei = ethers.parseUnits(value, from);
    let result = ethers.formatUnits(valueWei, to);

    const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
    result = result.match(removeTrailingZeroes)[1];

    logger.output(result);
  });

async function pickUnit({ name, description, from, to }) {
  let choices = units.concat();
  if (name === 'from' && to) choices = units.filter((unit) => unit !== to);
  if (name === 'to' && from) choices = units.filter((unit) => unit !== from);

  const prompt = new Select({
    message: `Select ${name} (${description})`,
    choices,
  });

  return await prompt.run().catch(() => process.exit(0));
}

unit.paramDefinitions['from'].prompt = pickUnit;
unit.paramDefinitions['to'].prompt = pickUnit;
