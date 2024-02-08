const { types } = require('hardhat/config');
const { Confirm } = require('enquirer');
const {
  getPopulatedFunctionSignature,
  getFunctionSignature,
} = require('../internal/signatures');
const loadAbi = require('./call/load-abi');
const fnPrompt = require('./call/fn-prompt');
const paramsPrompt = require('./call/params-prompt');
const abiPathPrompt = require('./call/abi-path-prompt');
const addressPrompt = require('./call/address-prompt');
const storage = require('../internal/storage');
const output = require('common/output');
const spinner = require('common/spinner');
const debug = require('common/debugger');

const call = require('../scopes/interact')
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
    'The parameters to use in the function call. Important: The parameters need to be a string in JSON format. Example: \'["0x123", 42]\'',
    undefined,
    types.json
  )
  .setAction(async ({ abiPath, address, fn, params }, hre) => {
    try {
      await interact({ abiPath, address, fn, params });
    } catch (err) {
      output.problem(err.message);
    }
  });

async function interact({ abiPath, address, fn, params }) {
  // TODO: Also validate
  if (!address) throw new Error('Address is required');
  // TODO: abiPath is not actually needed if fn is a signature
  if (!abiPath) throw new Error('abiPath is required');
  if (!fn) throw new Error('fn is required');

  const abi = loadAbi(abiPath);
  debug.log(abi, 'interact');

  const network = hre.network.config.name || hre.network.name;
  storage.rememberAbiAndAddress(abiPath, address, network);

  // Incoming params is a string
  // Make it an object
  params = JSON.parse(params || '[]');

  // Display call signature
  // E.g. "transfer(0x123 /*address _to*/, 42 /*uint256 _amount*/"
  const fnName = fn.split('(')[0];
  const abiFn = abi.find((abiFn) => abiFn.name?.includes(fnName));
  output.info(`Calling ${getPopulatedFunctionSignature(abiFn, params)}`);

  // Get the signature
  const sig = getFunctionSignature(abiFn);

  // Instantiate the contract
  let contract = await hre.ethers.getContractAt(abi, address);
  debug.log(`Instantiated contract: ${contract.target}`, 'interact');

  // Make the call
  const isReadOnly =
    abiFn.stateMutability === 'view' || abiFn.stateMutability === 'pure';
  if (isReadOnly) {
    let result;
    if (params.length > 0) {
      result = await contract[sig](...params);
    } else {
      result = await contract[sig]();
    }
    output.result(`Result: ${result}`);
  } else {
    // Connect signer
    const signer = (await hre.ethers.getSigners())[0];
    contract = contract.connect(signer);
    output.info(`Connected signer: ${signer.address}`);

    // Estimate gas
    const estimateGas = await contract[fn].estimateGas(...params);
    output.info(`Estimated gas: ${estimateGas}`);

    // Prompt the user for confirmation
    spinner.stop();
    const prompt = new Confirm({
      message: 'Do you want to proceed with the call?',
    });
    const response = await prompt.run().catch(() => process.exit(0));
    if (!response) return;

    const tx = await contract[fn](...params);
    output.info(`Sending transaction: ${tx.hash}`);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    output.info(`Transaction mined. Gas used: ${receipt.gasUsed.toString()}`);
    if (receipt.status === 0) {
      throw new Error(`Transaction mined but execution reverted: ${receipt}`);
    } else {
      // TODO: Parse receipt and display logs
      debug.log(JSON.stringify(receipt, null, 2), 'interact');
    }
  }
}

// Specialized prompts for each param
call.paramDefinitions['abiPath'].prompt = abiPathPrompt;
call.paramDefinitions['address'].prompt = addressPrompt;
call.paramDefinitions['fn'].prompt = fnPrompt;
call.paramDefinitions['params'].prompt = paramsPrompt;
