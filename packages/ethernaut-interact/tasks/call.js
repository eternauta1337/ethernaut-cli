const { types } = require('hardhat/config');
const { Confirm } = require('enquirer');
const {
  getPopulatedFunctionSignature,
  getFunctionSignature,
  getFullEventSignature,
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
const path = require('path');

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
  // TODO: abiPath is not actually needed if fn is a signature

  // TODO: Also validate
  if (!address) throw new Error('Address is required');
  if (!abiPath) throw new Error('abiPath is required');
  if (!fn) throw new Error('fn is required');

  debug.log('Interacting with', 'interact');
  debug.log(`abiPath: ${abiPath}`, 'interact');
  debug.log(`address: ${address}`, 'interact');
  debug.log(`fn: ${fn}`, 'interact');
  debug.log(`params: ${params}`, 'interact');

  const abi = loadAbi(abiPath);
  debug.log(abi, 'interact-deep');

  const network = hre.network.config.name || hre.network.name;

  storage.rememberAbiAndAddress(abiPath, address, network);

  // Display call signature
  // E.g. "transfer(0x123 /*address _to*/, 42 /*uint256 _amount*/"
  const fnName = fn.split('(')[0];
  const abiFn = abi.find((abiFn) => abiFn.name?.includes(fnName));
  const contractName = path.parse(abiPath).name;
  const sig = getFunctionSignature(abiFn);
  output.info(
    `Calling \`${contractName}.${getPopulatedFunctionSignature(
      abiFn,
      params
    )}\``
  );

  // Id signer
  spinner.progress('Connecting signer', 'interact');
  const signer = (await hre.ethers.getSigners())[0];
  output.info(`Using signer: ${signer.address}`);

  // Instantiate the contract
  spinner.progress('Preparing contract', 'interact');
  let contract = await hre.ethers.getContractAt(abi, address);
  contract = contract.connect(signer);

  debug.log(`Instantiated contract: ${contract.target}`, 'interact');

  // Make the call
  const isReadOnly =
    abiFn.stateMutability === 'view' || abiFn.stateMutability === 'pure';
  if (isReadOnly) {
    spinner.progress(`Reading contract`, 'interact');

    let result;
    if (params.length > 0) {
      result = await contract[sig](...params);
    } else {
      result = await contract[sig]();
    }

    spinner.success('Contract read successful', 'interact');

    output.result(`Result: ${result}`);
  } else {
    // Estimate gas
    spinner.progress('Estimating gas', 'interact');
    let estimateGas;
    try {
      estimateGas = await contract[fn].estimateGas(...params);
      spinner.success(`Gas estimated: ${estimateGas}`, 'interact');
    } catch (err) {
      spinner.fail('Gas estimation failed', 'interact');
      throw new Error(
        `Execution reverted during gas estimation: ${err.message}`
      );
    }

    // Prompt the user for confirmation
    const prompt = new Confirm({
      message: 'Do you want to proceed with the call?',
    });
    const response = await prompt.run().catch(() => process.exit(0));
    if (!response) return;

    spinner.progress('Sending transaction', 'interact');

    const tx = await contract[fn](...params);
    output.info(`Sending transaction: ${tx.hash}`);

    spinner.progress('Mining transaction', 'interact');

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Present tx receipggt
    debug.log(JSON.stringify(receipt, null, 2), 'interact-deep');
    output.info(`Transaction mined!`);
    output.info(`Gas used: ${receipt.gasUsed.toString()}`);
    output.info(`Gas price: ${receipt.gasPrice.toString()}`);
    output.info(`Block number: ${receipt.blockNumber}`);

    if (receipt.status === 0) {
      spinner.fail('Transaction reverted', 'interact');

      throw new Error(`Transaction mined but execution reverted: ${receipt}`);
    } else {
      spinner.success('Transaction mined successfully');

      // Display events
      const events = receipt.logs.map((log) =>
        contract.interface.parseLog(log)
      );
      if (events.length > 0) {
        output.info(`Emitted ${events.length} events:`);
        events.forEach((event) => {
          debug.log(event, 'interact-deep');

          const eventAbi = abi.find((item) => item.name === event.name);

          output.info(`${getFullEventSignature(eventAbi, event)}`);
        });
      } else {
        output.info('Emitted no events');
      }
    }
  }
}

// Specialized prompts for each param
call.paramDefinitions.abiPath.prompt = abiPathPrompt;
call.paramDefinitions.address.prompt = addressPrompt;
call.paramDefinitions.fn.prompt = fnPrompt;
call.paramDefinitions.params.prompt = paramsPrompt;
