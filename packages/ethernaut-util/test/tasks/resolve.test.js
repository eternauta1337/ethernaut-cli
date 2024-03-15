const assert = require('assert')

describe('resolve', function () {
  describe('when resolving vitalik.eth', function () {
    let output
    before('resolve', async function () {
      hre.ethers.provider = new hre.ethers.JsonRpcProvider(
        'https://ethereum-rpc.publicnode.com',
      )
      output = await hre.run(
        {
          scope: 'util',
          task: 'resolve',
        },
        { name: 'vitalik.eth' },
      )
    })

    it('resolves the correct address', async function () {
      assert.ok(output.includes('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'))
    })
  })
})
