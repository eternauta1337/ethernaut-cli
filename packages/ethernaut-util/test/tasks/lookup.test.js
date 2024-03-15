const assert = require('assert')

describe('lookup', function () {
  let output
  describe('when looking up vitalik.eth', function () {
    before('lookup', async function () {
      hre.ethers.provider = new hre.ethers.JsonRpcProvider(
        'https://ethereum-rpc.publicnode.com',
      )
      output = await hre.run(
        {
          scope: 'util',
          task: 'lookup',
        },
        { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
      )
    })

    it('finds the correct ens name', async function () {
      assert.ok(output.includes('vitalik.eth'))
    })
  })
})
