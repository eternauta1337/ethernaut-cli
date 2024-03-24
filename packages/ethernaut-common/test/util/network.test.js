const assert = require('assert')
const { getNetworkName, getChainId } = require('../../src/util/network')

describe('network', function () {
  describe('getNetworkName', function () {
    it('returns local', async function () {
      assert.equal(await getNetworkName(hre), 'local')
    })
  })

  describe('getChainId', function () {
    it('returns 31337', async function () {
      assert.equal(await getChainId(hre), 31337)
    })
  })
})
