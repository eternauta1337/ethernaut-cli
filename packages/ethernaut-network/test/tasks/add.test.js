const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('add', function () {
  const terminal = new Terminal()

  const removeTestNetworks = function () {
    const networks = storage.readNetworks()
    if ('test__1' in networks) delete networks.test__1
    if ('test__2' in networks) delete networks.test__2
    storage.storeNetworks(networks)
  }

  before('remove test networks', removeTestNetworks)
  after('remove test networks', removeTestNetworks)

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
      await terminal.run('npx hardhat net add --alias test__2', 2000)
    })

    it('suggests strategies', async function () {
      assert.ok(
        terminal.output.includes('How would you like to specify a provider?'),
        terminal.output,
      )
      assert.ok(terminal.output.includes('Known networks'), terminal.output)
      assert.ok(terminal.output.includes('Enter url manually'), terminal.output)
    })

    describe('when browse known networks is selected', function () {
      before('select strategy', async function () {
        await terminal.input('\r')
      })

      it('shows network', async function () {
        assert.ok(terminal.output.includes('Select a network'), terminal.output)
        assert.ok(terminal.output.includes('Ethereum Mainnet'), terminal.output)
        assert.ok(terminal.output.includes('Expanse Network'), terminal.output)
        assert.ok(terminal.output.includes('Ropsten'), terminal.output)
        assert.ok(terminal.output.includes('Rinkeby'), terminal.output)
        assert.ok(terminal.output.includes('Goerli'), terminal.output)
      })

      describe('when a network is chosen', function () {
        const publicNodeUrl = 'https://ethereum-rpc.publicnode.com'

        before('select network', async function () {
          await terminal.input('\r')
        })

        it('shows providers', async function () {
          assert.ok(
            terminal.output.includes('Select a provider'),
            terminal.output,
          )
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
