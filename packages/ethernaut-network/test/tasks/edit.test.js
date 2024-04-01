const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('edit', function () {
  const terminal = new Terminal()

  before('add test networks', async function () {
    const networks = storage.readNetworks()
    if (!('test__3' in networks)) networks.test__3 = { url: 'poop' }
    storage.storeNetworks(networks)
  })

  after('remove test networks', async function () {
    const networks = storage.readNetworks()
    if ('test__3' in networks) delete networks.test__3
    storage.storeNetworks(networks)
  })

  before('run edit', async function () {
    await terminal.run('hardhat network edit test__3 --url poop2')
  })

  it('edits the network', async function () {
    const networks = storage.readNetworks()
    assert.deepEqual(networks.test__3, { url: 'poop2' })
  })
})
