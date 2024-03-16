const types = require('ethernaut-common/src/validation/types')
const debug = require('ethernaut-common/src/util/debug')
const loadAbi = require('../internal/load-abi')
const output = require('ethernaut-common/src/ui/output')
const { getFullEventSignature } = require('../internal/signatures')
const { getChainId } = require('ethernaut-common/src/util/network')
const storage = require('../internal/storage')

require('../scopes/interact')
  .task('logs', 'Finds logs emitted by a contract')
  .addParam(
    'address',
    'The address of the contract that emits the logs',
    undefined,
    types.address,
  )
  .addParam(
    'abi',
    'The absolute path to a json file specifying the ABI of the contract. Must include the .json extension.',
    undefined,
    types.string,
  )
  .addParam('event', 'The event to look for', undefined, types.string)
  .addParam(
    'params',
    'The parameters to use for filtering logs. If multiple parameters are used, separate them with a comma. E.g. "0x123,42"',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'fromBlock',
    'The block number to start searching from. Defaults to 0 which is the genesis block. Use negative numbers to count from the latest block. E.g. -1 is the latest block, -2 is the block before that, etc.',
    '0',
    types.string,
  )
  .addOptionalParam(
    'toBlock',
    'The block number to stop searching at. Defaults to latest. Can also be negative.',
    'latest',
    types.string,
  )
  .setAction(
    async ({ address, abi, event, params, fromBlock, toBlock }, hre) => {
      try {
        // Parse params (incoming as string)
        params = params ? params.split(',') : []
        params = params.map((param) => (param === '' ? undefined : param))

        debug.log('Interacting with:', 'interact')
        debug.log(`abi: ${abi}`, 'interact')
        debug.log(`address: ${address}`, 'interact')
        debug.log(`event: ${event}`, 'interact')
        debug.log(`params: ${params}`, 'interact')
        debug.log(`fromBlock: ${fromBlock}`, 'interact')
        debug.log(`toBlock: ${toBlock}`, 'interact')

        fromBlock = parseInt(fromBlock)
        toBlock = toBlock === 'latest' ? toBlock : parseInt(toBlock)

        const chainId = await getChainId(hre)
        storage.rememberAbiAndAddress(abi, address, chainId)

        const _abi = loadAbi(abi)
        debug.log(_abi, 'interact-deep')

        const contract = await hre.ethers.getContractAt(_abi, address)

        const filter = contract.filters[event](...params)

        const logs = await contract.queryFilter(filter, fromBlock, toBlock)

        output.info(`Found ${logs.length} logs`)

        let strs = []
        logs.forEach((log, idx) => {
          log = contract.interface.parseLog(log)
          debug.log(event, 'interact-deep')

          const logAbi = contract.interface.fragments.find((item) => {
            return item.name !== undefined && item.name === log.name
          })

          const sig = getFullEventSignature(logAbi, log)

          strs.push(output.resultBox(sig, `Log ${idx + 1}`))
        })

        return strs.join('\n')
      } catch (err) {
        return output.errorBox(err)
      }
    },
  )
