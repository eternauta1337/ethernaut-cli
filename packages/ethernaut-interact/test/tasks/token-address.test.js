const { Terminal } = require('ethernaut-common/src/terminal')

describe('token-address', function () {
  const terminal = new Terminal()

  before('make call', async function () {
    await terminal.run(
      'npx hardhat interact token-address USDT --chain-id 1',
      2000,
    )
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
