const { Terminal, keys } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('local', function () {
  const terminal = new Terminal()

  describe('when parameters are not provided', function () {
    before('run', async function () {
      await terminal.run('npx hardhat net local', 2000)
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

  describe('when parameters are provided', function () {
    describe('with none', function () {
      before('run', async function () {
        await terminal.run(
          'npx hardhat net local --fork none --port 8547',
          2000,
        )
      })

      it('starts a local chain', async function () {
        terminal.has('Available Accounts')
      })
    })

    describe('with a valid network', function () {
      const rpcUrl = 'https://ethereum-rpc.publicnode.com'

      before('add test network', async function () {
        const networks = storage.readNetworks()
        if (!('test__mainnet' in networks))
          networks.test__mainnet = { url: rpcUrl }
        storage.storeNetworks(networks)
      })

      after('remove test network', async function () {
        const networks = storage.readNetworks()
        if ('test__mainnet' in networks) delete networks.test__mainnet
        storage.storeNetworks(networks)
      })

      before('run', async function () {
        await terminal.run(
          'npx hardhat net local --fork test__mainnet --port 8547',
          5000,
        )
      })

      it('starts a local forked chain', async function () {
        terminal.has(`Starting local chain with fork ${rpcUrl}...`)
      })
    })
  })
})
