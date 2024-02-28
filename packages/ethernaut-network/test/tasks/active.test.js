const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('active', function () {
  let activeNetwork
  const terminal = new Terminal()

  before('add test network', async function () {
    const networks = storage.readNetworks()
    if (!('test__8' in networks))
      networks.test__8 = { url: 'https://ethereum-rpc.publicnode.com' }
    networks.activeNetwork = 'test__8'
    storage.storeNetworks(networks)
  })

  after('remove test network', async function () {
    const networks = storage.readNetworks()
    if ('test__8' in networks) delete networks.test__8
    storage.storeNetworks(networks)
  })

  before('get the active network', async function () {
    activeNetwork = storage.readNetworks().activeNetwork
  })

  describe('when calling active task', function () {
    before('call task', async function () {
      await terminal.run('npx hardhat net active')
    })

    it('prints the active network', async function () {
      terminal.has(`The active network is "${activeNetwork}"`)
    })
  })
})
