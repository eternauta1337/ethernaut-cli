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
      assert.deepEqual(networks.test__1, { url: 'http://localhost:8545' })
    })
  })

  describe('when provider is missing', function () {
    before('run add', async function () {
      await terminal.run('npx hardhat net add --alias test__2', 2000)
    })

    it('suggests strategies', async function () {
      terminal.has('How would you like to specify a provider?')
      terminal.has('Known networks')
      terminal.has('Enter url manually')
    })

    describe('when browse known networks is selected', function () {
      before('select strategy', async function () {
        await terminal.input('\r')
      })

      it('shows network', async function () {
        terminal.has('Select a network')
        terminal.has('Ethereum Mainnet')
        terminal.has('Expanse Network')
        terminal.has('Ropsten')
        terminal.has('Rinkeby')
        terminal.has('Goerli')
      })

      describe('when a network is chosen', function () {
        const publicNodeUrl = 'https://ethereum-rpc.publicnode.com'

        before('select network', async function () {
          await terminal.input('\r')
        })

        it('shows providers', async function () {
          terminal.has('Select a provider')
          terminal.has('https://mainnet.infura.io/v3/${INFURA_API_KEY}')
          terminal.has(publicNodeUrl)
        })

        describe('when a provider is selected', function () {
          before('select provider', async function () {
            await terminal.input('pu\r')
          })

          it('adds the network', async function () {
            const networks = storage.readNetworks()
            assert.deepEqual(networks.test__2, { url: publicNodeUrl })
          })
        })
      })
    })
  })
})
