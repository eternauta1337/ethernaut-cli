const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('info', function () {
  const terminal = new Terminal()

  describe('when queryig info about mainnet', function () {
    before('add test network', async function () {
      const networks = storage.readNetworks()
      if (!('test__mainnet' in networks))
        networks.test__mainnet = { url: 'https://ethereum-rpc.publicnode.com' }
      storage.storeNetworks(networks)
    })

    after('remove test network', async function () {
      const networks = storage.readNetworks()
      if ('test__mainnet' in networks) delete networks.test__mainnet
      storage.storeNetworks(networks)
    })

    before('query', async function () {
      await terminal.run('npx hardhat net info --alias test__mainnet', 5000)
    })

    it('shows the expected results', async function () {
      assert.ok(terminal.output.includes('Name: Ethereum Mainnet'))
      assert.ok(terminal.output.includes('Currency: Ether (ETH)'))
      assert.ok(terminal.output.includes('Chain ID: 1'))
      assert.ok(terminal.output.includes('Gas price:'))
      assert.ok(terminal.output.includes('Block number'))
    })
  })
})
