const assert = require('assert')
const { Terminal, keys } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('local', function () {
  const terminal = new Terminal()

  describe('when the fork is not provided', function () {
    before('run', async function () {
      await terminal.run('npx hardhat net local', 2000)
    })

    it('queries for a network to fork', async function () {
      assert.ok(terminal.output.includes('Select a network to fork'))
      assert.ok(terminal.output.includes('none'))
    })

    describe('when none is selected', function () {
      before('press enter', async function () {
        await terminal.input('\n', 2000)
      })

      after('close', async function () {
        await terminal.input(keys.CTRLC, 1000)
      })

      it('starts a local chain', async function () {
        assert.ok(terminal.output.includes('Available Accounts'))
      })
    })
  })

  describe('when the fork is provided', function () {
    describe('with none', function () {
      before('run', async function () {
        await terminal.run('npx hardhat net local --fork none', 2000)
      })

      it('starts a local chain', async function () {
        assert.ok(terminal.output.includes('Available Accounts'))
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
        await terminal.run('npx hardhat net local --fork test__mainnet', 5000)
      })

      it('starts a local forked chain', async function () {
        assert.ok(
          terminal.output.includes(
            `Starting local chain with fork ${rpcUrl}...`,
          ),
        )
      })
    })
  })
})
