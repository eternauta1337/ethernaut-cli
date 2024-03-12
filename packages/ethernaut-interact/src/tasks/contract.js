const path = require('path')
const { types } = require('hardhat/config')
const getBalance = require('../internal/get-balance')
const mineTx = require('../internal/mine-tx')
const {
  getPopulatedFunctionSignature,
  getFunctionSignature,
} = require('../internal/signatures')
const loadAbi = require('./contract/load-abi')
const prompt = require('ethernaut-common/src/prompt')
const storage = require('../internal/storage')
const output = require('ethernaut-common/src/output')
const spinner = require('ethernaut-common/src/spinner')
const debug = require('ethernaut-common/src/debug')
const connectSigner = require('../internal/connect-signer')
const printTxSummary = require('../internal/print-tx-summary')
const { getNetworkName } = require('ethernaut-common/src/network')

require('../scopes/interact')
  .task('contract', 'Interacts with a contract')
  .addParam(
    'abi',
    'The path to a json file specifying the abi of the contract',
    undefined,
    types.string,
  )
  .addParam('address', 'The address of the contract', undefined, types.string)
  .addParam(
    'fn',
    'The function of the contract to call',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'value',
    'The amount of ether to send with the transaction',
    undefined,
    types.string,
  )
  .addParam(
    'params',
    'The parameters to use in the function call. If the call requires multiple parameters, separate them with a comma. E.g. "0x123,42"',
    undefined,
    types.string,
  )
  .addFlag(
    'noConfirm',
    'Skip confirmation prompts, avoiding any type of interactivity',
  )
  .setAction(async ({ abi, address, fn, params, value, noConfirm }) => {
    try {
      return await interact({ abi, address, fn, params, value, noConfirm })
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function interact({ abi, address, fn, params, value, noConfirm }) {
  // TODO: abi is not actually needed if fn is a signature

  // Parse params (incoming as string)
  params = params ? params.split(',') : []

  // TODO: Also validate
  if (!address) throw new Error('Address is required')
  if (!abi) throw new Error('abi is required')
  if (!fn) throw new Error('fn is required')
  if (!value) value = '0'

  debug.log('Interacting with:', 'interact')
  debug.log(`abi: ${abi}`, 'interact')
  debug.log(`address: ${address}`, 'interact')
  debug.log(`fn: ${fn}`, 'interact')
  debug.log(`params: ${params}`, 'interact')
  debug.log(`value: ${value}`, 'interact')

  const _abi = loadAbi(abi)
  debug.log(_abi, 'interact-deep')

  const network = await getNetworkName(hre)

  // Instantiate the contract
  spinner.progress('Preparing contract', 'interact')
  let contract = await hre.ethers.getContractAt(_abi, address)
  spinner.success('Contract instantiated', 'interact')
  debug.log(`Instantiated contract: ${contract.target}`, 'interact')

  // Id the function to call
  const fnName = fn.split('(')[0]
  const abiFn = _abi.find((abiFn) => abiFn.name?.includes(fnName))
  const sig = getFunctionSignature(abiFn)

  // Double check params
  if (abiFn.inputs.length !== params.length) {
    throw new Error(
      `Invalid number of parameters. Expected ${abiFn.inputs.length}, got ${params.length}`,
    )
  }

  // Remember this interaction
  // TODO: Only if successful?
  storage.rememberAbiAndAddress(abi, address, network)

  // Execute read or write
  const isReadOnly =
    abiFn.stateMutability === 'view' || abiFn.stateMutability === 'pure'
  if (isReadOnly) {
    return await executeRead(contract, sig, params)
  } else {
    const signer = await connectSigner(noConfirm)
    contract = contract.connect(signer)

    return await executeWrite(
      signer,
      contract,
      abiFn,
      sig,
      params,
      value,
      noConfirm,
      abi,
      address,
    )
  }
}

async function executeRead(contract, sig, params) {
  spinner.progress('Reading contract', 'interact')

  let result
  if (params.length > 0) {
    result = await contract[sig](...params)
  } else {
    result = await contract[sig]()
  }

  spinner.success('Contract read successful', 'interact')
  return output.resultBox(`${sig} => ${result}`, 'Read Contract')
}

async function executeWrite(
  signer,
  contract,
  abiFn,
  sig,
  params,
  value,
  noConfirm,
  abi,
  address,
) {
  let buffer = ''

  // Build tx params
  const isPayable = abiFn.payable || abiFn.stateMutability === 'payable'
  const txParams = {}
  if (isPayable) txParams.value = hre.ethers.parseEther(value)

  // Estimate gas
  spinner.progress('Estimating gas', 'interact')
  let estimateGas
  try {
    estimateGas = await contract[sig].estimateGas(...params, txParams)
    spinner.success(`Gas estimated: ${estimateGas}`, 'interact')
  } catch (err) {
    spinner.fail('Gas estimation failed', 'interact')
    throw new Error(`Execution reverted during gas estimation: ${err.message}`)
  }

  // Display tx summary
  const contractName = path.parse(abi).name
  buffer += await printTxSummary({
    signer,
    to: address,
    value: value,
    description: `${contractName}.${getPopulatedFunctionSignature(
      abiFn,
      params,
    )}`,
  })

  // Prompt the user for confirmation
  // TODO: Also calculate ETH cost for gas and warn loudly if high
  if (!noConfirm) {
    const response = await prompt({
      type: 'confirm',
      message: 'Do you want to proceed with the call?',
    })
    if (!response) return
  }

  spinner.progress('Sending transaction', 'interact')

  const tx = await contract[sig](...params, txParams)

  spinner.success('Transaction sent', 'interact')

  buffer += await mineTx(tx, contract)

  buffer += output.info(
    `Resulting balance: ${await getBalance(signer.address)}`,
  )

  return buffer
}
