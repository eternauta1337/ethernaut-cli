const { types } = require('hardhat/config');
const getBalance = require('../internal/get-balance');
const mineTx = require('../internal/mine-tx');
const {
  getPopulatedFunctionSignature,
  getFunctionSignature,
} = require('../internal/signatures');
const loadAbi = require('./call/load-abi');
const prompt = require('common/prompt');
const fnPrompt = require('./call/fn-prompt');
const paramsPrompt = require('./call/params-prompt');
const abiPathPrompt = require('./call/abi-path-prompt');
const addressPrompt = require('./call/address-prompt');
const valuePrompt = require('./call/value-prompt');
const storage = require('../internal/storage');
const output = require('common/output');
const spinner = require('common/spinner');
const debug = require('common/debug');
const path = require('path');
const connectSigner = require('../internal/connect-signer');
const printTxSummary = require('../internal/print-tx-summary');

const call = require('../scopes/interact')
  .task('call', 'Calls a contract function')
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
    'value',
    'The amount of ether to send with the transaction',
    undefined,
    types.string
  )
  .addOptionalParam(
    'params',
    'The parameters to use in the function call. If the call requires multiple parameters, separate them with a comma. E.g. "0x123,42"',
    undefined,
    types.string
  )
  .addOptionalParam(
    'noConfirm',
    'Skip confirmation prompts, avoiding any type of interactivity',
    false,
    types.boolean
  )
  .setAction(
    async ({ abiPath, address, fn, params, value, noConfirm }, hre) => {
      try {
        await interact({ abiPath, address, fn, params, value, noConfirm });
      } catch (err) {
        debug.log(err, 'interact');
        output.problem(err.message);
      }
    }
  );

async function interact({ abiPath, address, fn, params, value, noConfirm }) {
  // TODO: abiPath is not actually needed if fn is a signature

  // Parse params (incoming as string)
  params = params ? params.split(',') : [];

  // TODO: Also validate
  if (!address) throw new Error('Address is required');
  if (!abiPath) throw new Error('abiPath is required');
  if (!fn) throw new Error('fn is required');
  if (!value) value = '0';

  debug.log('Interacting with', 'interact');
  debug.log(`abiPath: ${abiPath}`, 'interact');
  debug.log(`address: ${address}`, 'interact');
  debug.log(`fn: ${fn}`, 'interact');
  debug.log(`params: ${params}`, 'interact');
  debug.log(`value: ${value}`, 'interact');

  const abi = loadAbi(abiPath);
  debug.log(abi, 'interact-deep');

  const network = hre.network.config.name || hre.network.name;

  const signer = await connectSigner(noConfirm);

  // Instantiate the contract
  spinner.progress('Preparing contract', 'interact');
  let contract = await hre.ethers.getContractAt(abi, address);
  contract = contract.connect(signer);
  spinner.success('Contract instantiated', 'interact');
  debug.log(`Instantiated contract: ${contract.target}`, 'interact');

  // Id the function to call
  const fnName = fn.split('(')[0];
  const abiFn = abi.find((abiFn) => abiFn.name?.includes(fnName));
  const sig = getFunctionSignature(abiFn);

  // Double check params
  if (abiFn.inputs.length !== params.length) {
    throw new Error(
      `Invalid number of parameters. Expected ${abiFn.inputs.length}, got ${params.length}`
    );
  }

  // Remember this interaction
  // TODO: Only if successful?
  storage.rememberAbiAndAddress(abiPath, address, network);

  // Execute read or write
  const isReadOnly =
    abiFn.stateMutability === 'view' || abiFn.stateMutability === 'pure';
  if (isReadOnly) {
    await executeRead(contract, sig, params);
  } else {
    await executeWrite(
      signer,
      contract,
      abiFn,
      sig,
      params,
      value,
      noConfirm,
      abiPath,
      address
    );
  }
}

async function executeRead(contract, sig, params) {
  spinner.progress(`Reading contract`, 'interact');

  let result;
  if (params.length > 0) {
    result = await contract[sig](...params);
  } else {
    result = await contract[sig]();
  }

  spinner.success('Contract read successful', 'interact');

  output.resultBox('Read Contract', [`${sig} => ${result}`]);
}

async function executeWrite(
  signer,
  contract,
  abiFn,
  sig,
  params,
  value,
  noConfirm,
  abiPath,
  address
) {
  // Build tx params
  const isPayable = abiFn.payable || abiFn.stateMutability === 'payable';
  const txParams = {};
  if (isPayable) txParams.value = hre.ethers.parseEther(value);

  // Estimate gas
  spinner.progress('Estimating gas', 'interact');
  let estimateGas;
  try {
    estimateGas = await contract[sig].estimateGas(...params, txParams);
    spinner.success(`Gas estimated: ${estimateGas}`, 'interact');
  } catch (err) {
    spinner.fail('Gas estimation failed', 'interact');
    throw new Error(`Execution reverted during gas estimation: ${err.message}`);
  }

  // Display tx summary
  const contractName = path.parse(abiPath).name;
  await printTxSummary({
    signer,
    to: address,
    value: value,
    description: `${contractName}.${getPopulatedFunctionSignature(
      abiFn,
      params
    )}`,
  });

  // Prompt the user for confirmation
  // TODO: Also calculate ETH cost for gas and warn loudly if high
  if (!noConfirm) {
    const response = await prompt({
      type: 'confirm',
      message: 'Do you want to proceed with the call?',
    });
    if (!response) return;
  }

  spinner.progress('Sending transaction', 'interact');

  const tx = await contract[sig](...params, txParams);
  output.info(`Sending transaction: ${tx.hash}`);

  await mineTx(tx, contract);

  output.info(`Resulting balance: ${await getBalance(signer.address)}`);
}

// Specialized prompts for each param
call.paramDefinitions.abiPath.prompt = abiPathPrompt;
call.paramDefinitions.address.prompt = addressPrompt;
call.paramDefinitions.fn.prompt = fnPrompt;
call.paramDefinitions.params.prompt = paramsPrompt;
call.paramDefinitions.value.prompt = valuePrompt;
