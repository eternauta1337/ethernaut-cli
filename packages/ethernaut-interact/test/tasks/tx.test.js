const assert = require('assert')

describe('tx', function () {
  let output
  describe('when decoding 0x4054d7d608e735608ac6fe70609f9a9616215309e576e975414c4f73374b0b78', function () {
    before('tx', async function () {
      hre.ethers.provider = new hre.ethers.JsonRpcProvider(
        'https://ethereum-rpc.publicnode.com',
      )
      output = await hre.run(
        {
          scope: 'interact',
          task: 'tx',
        },
        {
          transactionId:
            '0x4054d7d608e735608ac6fe70609f9a9616215309e576e975414c4f73374b0b78',
          abi: './abis/dai.json',
        },
      )
    })

    it('finds the functionName', async function () {
      assert.ok(output.includes('functionName'))
    })
  })
})
