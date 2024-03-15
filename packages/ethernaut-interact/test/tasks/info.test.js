const assert = require('assert')

describe('info', function () {
  describe('when retrieving info about USDT', function () {
    let output
    before('resolve', async function () {
      hre.ethers.provider = new hre.ethers.JsonRpcProvider(
        'https://ethereum-rpc.publicnode.com',
      )
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
