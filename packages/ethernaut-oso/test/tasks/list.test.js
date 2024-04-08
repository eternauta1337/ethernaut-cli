const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('list', function () {
  const terminal = new Terminal()

  before('list', async function () {
    await terminal.run('hardhat oso list ethers')
  })

  it('lists projects', async function () {
    terminal.has('Etherscan (etherscan)')
    terminal.has('etherspot (etherspot)')
    terminal.has('EtherScore (etherscore)')
    terminal.has('ethers.js (ethers-io)')
  })
})
