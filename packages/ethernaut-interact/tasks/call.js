const { types } = require('hardhat/config');
const { AutoComplete, Input } = require('enquirer');
const suggest = require('utilities/enquirer-suggest');
const interact = require('../scopes/interact');
const fs = require('fs');

let abi;

const call = interact
  .task('call', 'Calls a contract function')
  // TODO: Remove optionality once I can extend environment before parsing tasks
  .addOptionalParam(
    'abiPath',
    'The path of a json file defining the abi of the contract',
    undefined,
    types.string
  )
  .addOptionalParam(
    'address',
    'The address of the contract',
    undefined,
    types.string
  )
  .addOptionalParam(
    'fn',
    'The function of the contract to call',
    undefined,
    types.string
  )
  .addOptionalParam(
    'params',
    'The parameters to use in the function call',
    undefined,
    types.json
  )
  .setAction(async ({ abiPath, address, fn, params }, hre) => {
    loadAbi(abiPath);

    // TODO: Make call
  });

function loadAbi(abiPath) {
  if (!abiPath) return;
  if (abi) return;

  // TODO: Validate path
  abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
}

call.paramDefinitions['fn'].prompt = async ({ abiPath }) => {
  loadAbi(abiPath);

  const abiFns = abi.filter((fn) => fn.name && fn.type === 'function');

  const choices = abiFns.map(
    (fn) => `${fn.name}(${fn.inputs.map((input) => input.type).join(',')})`
  );

  const prompt = new AutoComplete({
    type: 'autocomplete',
    message: 'Pick a function',
    limit: 15,
    suggest,
    choices,
  });

  const response = await prompt.run().catch(() => process.exit(0));
  console.log(response);

  return response;
};

call.paramDefinitions['params'].prompt = async ({ abiPath, fn }) => {
  loadAbi(abiPath);

  const abiFn = abi.find((abiFn) => abiFn.name === fn.split('(')[0]);

  let params = [];
  for (const input of abiFn.inputs) {
    const prompt = new Input({
      message: `Enter ${input.name} (${input.type})`,
    });

    const response = await prompt.run().catch(() => process.exit(0));

    params.push(response);
  }

  return JSON.stringify(params);
};
