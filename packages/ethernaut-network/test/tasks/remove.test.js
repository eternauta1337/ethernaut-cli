const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('remove', function () {
  const terminal = new Terminal()

  before('add test networks', async function () {
    const networks = storage.readNetworks()
    if (!('test__3' in networks)) networks.test__3 = { url: 'poop' }
    if (!('test__4' in networks)) networks.test__4 = { url: 'poop' }
    storage.storeNetworks(networks)
  })

  describe('when all params are specified', function () {
    before('run remove', async function () {
      await terminal.run('npx hardhat net remove --alias test__3')
    })

    it('removes the network', async function () {
      const networks = storage.readNetworks()
      assert.equal(networks.test__3, undefined)
    })
  })

  describe('when alias is missing', function () {
    before('run remove', async function () {
      await terminal.run('npx hardhat net remove', 1000)
    })

    it('suggests networks', async function () {
      assert.ok(
        terminal.output.includes('Select a network'),
        terminal.output.includes('test__4'),
      )
    })

    describe('when a network is chosen', function () {
      before('select', async function () {
        await terminal.input('4\r')
      })

      it('removes the network', async function () {
        const networks = storage.readNetworks()
        assert.equal(networks.test__4, undefined)
      })
    })
  })
})
