const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('token', function () {
  const terminal = new Terminal()

  before('make call', async function () {
    await terminal.run('npx hardhat util token usdt --chain 1', 3000)
  })

  it('shows the token name', async function () {
    terminal.has('Tether (USDT)')
  })

  it('shows the network', async function () {
    terminal.has('Ethereum Mainnet')
  })

  it('shows the address', async function () {
    terminal.has('0xdAC17F958D2ee523a2206206994597C13D831ec7')
  })
})
