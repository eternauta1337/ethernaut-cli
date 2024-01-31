const { types } = require('hardhat/config');
const { Confirm } = require('enquirer');
const { getPopulatedFunctionSignature } = require('../internal/signatures');
const interact = require('../scopes/interact');
const loadAbi = require('./call/load-abi');
const fnPrompt = require('./call/fn-prompt');
const paramsPrompt = require('./call/params-prompt');
const abiPathPrompt = require('./call/abi-path-prompt');

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
    const abi = loadAbi(abiPath);

    // Incoming params is a string
    // Make it an object
    params = JSON.parse(params);

    // Display call signature
    // E.g. "transfer(0x123 /*address _to*/, 42 /*uint256 _amount*/"
    const abiFn = abi.find((abiFn) => abiFn.name === fn.split('(')[0]);
    console.log('Calling', getPopulatedFunctionSignature(abiFn, params));

    // TODO: Estimate gas

    // Prompt the user for confirmation,
    // if the function is mutative
    if (abiFn.stateMutability !== 'view' && abiFn.stateMutability !== 'pure') {
      const prompt = new Confirm({
        message: 'Do you want to proceed with the call?',
      });

      const response = await prompt.run().catch(() => process.exit(0));
      if (!response) return;
    }

    // TODO: Make call
    console.log(
      'Feature not available: Cannot make calls yet until providers and signers are introduced'
    );
  });

// Specialized prompts for each param
call.paramDefinitions['abiPath'].prompt = abiPathPrompt;
call.paramDefinitions['fn'].prompt = fnPrompt;
call.paramDefinitions['params'].prompt = paramsPrompt;
