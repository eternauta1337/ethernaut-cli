const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('list', function () {
  const terminal = new Terminal()

  before('add some networks', async function () {
    const networks = storage.readNetworks()
    if (!('test__3' in networks)) networks.test__3 = { url: 'poop' }
    if (!('test__4' in networks)) networks.test__4 = { url: 'poop' }
    storage.storeNetworks(networks)
  })

  after('remove networks', async function () {
    const networks = storage.readNetworks()
    if ('test__3' in networks) delete networks.test__3
    if ('test__4' in networks) delete networks.test__4
    storage.storeNetworks(networks)
  })

  describe('when calling list', function () {
    before('call', async function () {
      await terminal.run('npx hardhat net list')
    })

    it('prints the networks', async function () {
      assert.ok(terminal.output.includes('- test__3 (poop)'), terminal.output)
      assert.ok(terminal.output.includes('- test__4 (poop)'), terminal.output)
    })
  })
})
