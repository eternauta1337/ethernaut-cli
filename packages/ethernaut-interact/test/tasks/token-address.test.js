const { Terminal } = require('ethernaut-common/src/terminal')

describe('token-address', function () {
  const terminal = new Terminal()

  let getNetworkCache

  before('simulate network', async function () {
    getNetworkCache = hre.ethers.provider.getNetwork
    hre.ethers.provider.getNetwork = async function () {
      return {
        chainId: 1,
      }
    }
  })

  after('restore provider', async function () {
    hre.ethers.provider.getNetwork = getNetworkCache
  })

  describe('when querying for the address of USDT on mainnet', function () {
    before('make call', async function () {
      await terminal.run('npx hardhat interact token-address USDT', 2000)
    })

    it('shows the token name', async function () {
      terminal.has('Token name: USDT')
    })

    it('shows the network', async function () {
      terminal.has('Network: Ethereum Mainnet')
    })

    it('shows the symbol', async function () {
      terminal.has('Symbol: USDT')
    })

    it('shows the address', async function () {
      terminal.has('Address: 0xdac17f958d2ee523a2206206994597c13d831ec7')
    })
  })
})
