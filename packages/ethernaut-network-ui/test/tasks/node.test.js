const { Terminal, keys } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('node ui', function () {
  const terminal = new Terminal()

  before('add test network', async function () {
    const networks = storage.readNetworks()
    if (!('test__9' in networks)) networks.test__9 = { url: 'poop' }
    storage.storeNetworks(networks)
  })

  after('remove test network', async function () {
    const networks = storage.readNetworks()
    if ('test__9' in networks) delete networks.test__9
    storage.storeNetworks(networks)
  })

  describe('when parameters are not provided', function () {
    before('run', async function () {
      await terminal.run('hardhat network node', 2000)
    })

    it('queries for a network to fork', async function () {
      terminal.has('Select a network to fork')
      terminal.has('none')
    })

    describe('when none is selected', function () {
      before('enter parameters', async function () {
        await terminal.input('\n', 2000)
      })

      it('queries for a port number', async function () {
        terminal.has('Enter port')
      })

      describe('when 8546 is entered', function () {
        before('input', async function () {
          await terminal.input('8546\n', 2000)
        })

        after('close', async function () {
          await terminal.input(keys.CTRLC, 1000)
        })

        it('starts a local chain', async function () {
          terminal.has('Listening on 127.0.0.1:8546')
        })
      })
    })
  })
})
