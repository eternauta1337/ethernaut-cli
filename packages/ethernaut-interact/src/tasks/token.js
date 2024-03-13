const { types } = require('hardhat/config')
const storage = require('../internal/storage')

require('../scopes/interact')
  .task('token', 'Interacts with any ERC20 token')
  .addParam('address', 'The address of the token', undefined, types.string)
  .addParam('fn', 'The function of the token to call', undefined, types.string)
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
  .setAction(async ({ address, fn, params, value, noConfirm }) => {
    const abi = storage.findAbi('ERC20')

    return await hre.run(
      { scope: 'interact', task: 'contract' },
      { abi, address, fn, params, value, noConfirm },
    )
  })
