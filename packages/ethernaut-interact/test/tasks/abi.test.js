const assert = require('assert')

describe('abi', function () {
  describe('when looking for an erc20 abi', function () {
    let output

    before('run ', async function () {
      output = await hre.run(
        { scope: 'interact', task: 'abi' },
        { filter: 'erc20' },
      )
    })

    it('prints out the expected values', async function () {
      assert.ok(output.includes('interact/abis/erc20.json'), output)
      assert.ok(output.includes('interact/abis/DelegateERC20.json'), output)
    })
  })
})
