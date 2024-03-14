const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const interact = require('../internal/interact')

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
