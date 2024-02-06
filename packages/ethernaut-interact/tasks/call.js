const { types } = require('hardhat/config');
const { Confirm } = require('enquirer');
const {
  getPopulatedFunctionSignature,
  getFunctionSignature,
} = require('../internal/signatures');
const interact = require('../scopes/interact');
const loadAbi = require('./call/load-abi');
const fnPrompt = require('./call/fn-prompt');
const paramsPrompt = require('./call/params-prompt');
const abiPathPrompt = require('./call/abi-path-prompt');
const storage = require('../internal/storage');

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
    'The parameters to use in the function call. Important: The parameters need to be a string in JSON format. Example: \'["0x123", 42]\'',
    undefined,
    types.json
  )
  .setAction(async ({ abiPath, address, fn, params }, hre) => {
    const abi = loadAbi(abiPath);
    // console.log(abi);

    const network = hre.network.config.name || hre.network.name;
    storage.rememberAbiAndAddress(abiPath, address, network);

    // Incoming params is a string
    // Make it an object
    params = JSON.parse(params || '[]');

    // Display call signature
    // E.g. "transfer(0x123 /*address _to*/, 42 /*uint256 _amount*/"
    const fnName = fn.split('(')[0];
    const abiFn = abi.find((abiFn) => abiFn.name?.includes(fnName));
    console.log('Calling', getPopulatedFunctionSignature(abiFn, params));

    // Get the signature
    const sig = getFunctionSignature(abiFn);

    // Instantiate the contract
    let contract = await hre.ethers.getContractAt(abi, address);
    console.log('Instantiated contract:', contract.target);

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
      console.log('Result:', result);
    } else {
      // Connect signer
      const signer = (await hre.ethers.getSigners())[0];
      contract = contract.connect(signer);
      console.log('Connected signer:', signer.address);

      // Estimate gas
      const estimateGas = await contract[fn].estimateGas(...params);
      console.log('Estimated gas:', estimateGas.toString());

      // Prompt the user for confirmation
      const prompt = new Confirm({
        message: 'Do you want to proceed with the call?',
      });
      const response = await prompt.run().catch(() => process.exit(0));
      if (!response) return;

      const tx = await contract[fn](...params);
      console.log('Sending transaction:', tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined. Gas used:', receipt.gasUsed.toString());
      if (receipt.status === 0) {
        console.error('Transaction mined but execution reverted:', receipt);
      } else {
        console.log('Transaction mined and execution completed.');
        // TODO: Parse receipt and display logs
        // console.log(JSON.stringify(receipt, null, 2));
      }
    }
  });

// Specialized prompts for each param
call.paramDefinitions['abiPath'].prompt = abiPathPrompt;
call.paramDefinitions['fn'].prompt = fnPrompt;
call.paramDefinitions['params'].prompt = paramsPrompt;
