const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('../../src/internal/storage')

describe('set', function () {
  const terminal = new Terminal()
  let activeNetwork

  before('read the active network', async function () {
    activeNetwork = storage.readNetworks().activeNetwork
  })

  after('restore the active network', async function () {
    const networks = storage.readNetworks()
    networks.activeNetwork = activeNetwork
    storage.storeNetworks(networks)
  })

  before('inject a dummy network', async function () {
    const networks = storage.readNetworks()
    networks.test__1 = { url: 'http://localhost:8545' }
    storage.storeNetworks(networks)
  })

  after('remove dummy network', async function () {
    const networks = storage.readNetworks()
    if ('test__1' in networks) delete networks.test__1
    storage.storeNetworks(networks)
  })

  describe('when calling set', function () {
    before('call set', async function () {
      await terminal.run('npx hardhat network set test__1', 2000)
    })

    it('sets the active network', async function () {
      const networks = storage.readNetworks()
      assert.equal(networks.activeNetwork, 'test__1')
    })
  })
})
