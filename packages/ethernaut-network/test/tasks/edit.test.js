const assert = require('assert')
const { Terminal } = require('common/src/terminal')
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

  describe('when all params are specified', function () {
    before('run edit', async function () {
      await terminal.run('npx hardhat net edit --alias test__3 --url poop2')
    })

    it('edits the network', async function () {
      const networks = storage.readNetworks()
      assert.deepEqual(networks.test__3, { url: 'poop2' })
    })
  })

  describe('when parameters are missing', function () {
    before('run edit', async function () {
      await terminal.run('npx hardhat net edit', 2000)
    })

    it('suggests networks', async function () {
      terminal.has('Select a network to edit')
      terminal.has('test__3')
    })

    describe('when a network is chosen', function () {
      before('select', async function () {
        await terminal.input('3\r')
      })

      it('prompts for url', async function () {
        terminal.has('Enter url')
      })

      describe('when url is entered', function () {
        before('enter url', async function () {
          await terminal.input('poop3\r')
        })

        it('edited the network', async function () {
          const networks = storage.readNetworks()
          assert.deepEqual(networks.test__3, { url: 'poop3' })
        })
      })
    })
  })
})
