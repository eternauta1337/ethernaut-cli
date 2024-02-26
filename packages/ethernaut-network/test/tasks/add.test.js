const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('task', function () {
  const terminal = new Terminal()

  before('remove test networks', async function () {
    const networks = storage.readNetworks()
    if ('test__1' in networks) delete networks.test__1
    if ('test__2' in networks) delete networks.test__2
    storage.storeNetworks(networks)
  })

  describe('when all params are specified', function () {
    before('run add', async function () {
      await terminal.run(
        'npx hardhat net add --alias test__1 --provider http://localhost:8545',
      )
    })

    it('adds the network', async function () {
      const networks = storage.readNetworks()
      assert.ok(networks.test__1, { url: 'http://localhost:8545' })
    })
  })

  describe('when provider is missing', function () {
    before('run add', async function () {
      await terminal.run('npx hardhat net add --alias test__2', 1000)
    })

    it('suggests strategies', async function () {
      assert.ok(
        terminal.output.includes('How would you like to specify a provider?'),
        terminal.output.includes('Known networks'),
        terminal.output.includes('Enter url manually'),
      )
    })

    describe('when browse known networks is selected', function () {
      before('select strategy', async function () {
        await terminal.input('\r')
      })

      it('shows network', async function () {
        assert.ok(terminal.output.includes('Select a network'))
        assert.ok(terminal.output.includes('Ethereum Mainnet'))
        assert.ok(terminal.output.includes('Expanse Network'))
        assert.ok(terminal.output.includes('Ropsten'))
        assert.ok(terminal.output.includes('Rinkeby'))
        assert.ok(terminal.output.includes('Goerli'))
      })

      describe('when a network is chosen', function () {
        const publicNodeUrl = 'https://ethereum-rpc.publicnode.com'

        before('select network', async function () {
          await terminal.input('\r')
        })

        it('shows providers', async function () {
          assert.ok(terminal.output.includes('Select a provider'))
          assert.ok(
            terminal.output.includes(
              'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
            ),
          )
          assert.ok(terminal.output.includes(publicNodeUrl))
        })

        describe('when a provider is selected', function () {
          before('select provider', async function () {
            await terminal.input('pu\r')
          })

          it('adds the network', async function () {
            const networks = storage.readNetworks()
            assert.ok(networks.test__2, { url: publicNodeUrl })
          })
        })
      })
    })
  })
})
