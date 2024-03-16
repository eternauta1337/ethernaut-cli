const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('token', function () {
  const terminal = new Terminal()

  before('make call', async function () {
    await terminal.run('npx hardhat util token usdt --chain 1', 2000)
  })

  it('shows the token name', async function () {
    terminal.has('Token name: usdt')
  })

  it('shows the network', async function () {
    terminal.has('Network: Ethereum Mainnet')
  })

  it('shows the symbol', async function () {
    terminal.has('Symbol: USDT')
  })

  it('shows the address', async function () {
    terminal.has('Address: 0xdAC17F958D2ee523a2206206994597C13D831ec7')
  })
})
