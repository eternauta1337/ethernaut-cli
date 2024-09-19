const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('chain', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat metrics chain --project Synthetix')
  })

  it('shows Synthetix', async function () {
    terminal.has('displayName: Synthetix')
  })
})
