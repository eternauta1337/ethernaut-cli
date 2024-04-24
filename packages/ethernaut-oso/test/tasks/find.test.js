const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('find', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat metrics find ethers')
  })

  it('lists projects', async function () {
    terminal.has('Etherscan (etherscan)')
    terminal.has('etherspot (etherspot)')
    terminal.has('EtherScore (etherscore)')
    terminal.has('ethers.js (ethers-io)')
  })
})
