const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('find', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat metrics find ethers')
  })

  it('lists projects', async function () {
    terminal.has('etherscore')
    terminal.has('etherscan')
    terminal.has(
      'etherspot - Account Abstraction SDK for EVM-compatible chains.',
    )
    terminal.has(
      'ethers-io - Hub to use, share and develop Ethereum Applications.',
    )
  })
})
