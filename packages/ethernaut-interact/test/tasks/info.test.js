const assert = require('assert')

describe('info', function () {
  describe('when retrieving info about USDT', function () {
    let output
    let providerCache

    before('use chain id 1', async function () {
      providerCache = hre.ethers.provider
      hre.ethers.provider = new hre.ethers.JsonRpcProvider(
        'https://ethereum-rpc.publicnode.com',
      )
    })

    after('restore provider', async function () {
      hre.ethers.provider = providerCache
    })

    before('call info', async function () {
      output = await hre.run(
        {
          scope: 'interact',
          task: 'info',
        },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
      )
    })

    it('Shows the correct name', async function () {
      assert.ok(output.includes('Contract: TetherToken'))
    })
  })
})
