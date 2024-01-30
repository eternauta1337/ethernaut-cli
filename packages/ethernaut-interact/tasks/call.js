const { types } = require('hardhat/config');
const interact = require('../scopes/interact');
const fs = require('fs');

interact
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
    [],
    types.json
  )
  .setAction(async ({ abiPath, address, fn, params }, hre) => {
    // TODO: Validate path
    abi = fs.readFileSync(abiPath, 'utf8');
  });
