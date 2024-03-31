const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('../../src/internal/storage')

describe('list', function () {
  const terminal = new Terminal()

  before('add some networks', async function () {
    const networks = storage.readNetworks()
    if (!('test__3' in networks)) networks.test__3 = { url: 'poop' }
    if (!('test__4' in networks))
      networks.test__4 = { url: 'http://www.google.com' }
    networks.activeNetwork = 'test__4'
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
      await terminal.run('npx nyc hardhat network list')
    })

    it('prints the networks', async function () {
      terminal.has('- test__3 (poop)')
      terminal.has('> test__4 (http://www.google.com)')
    })
  })
})
