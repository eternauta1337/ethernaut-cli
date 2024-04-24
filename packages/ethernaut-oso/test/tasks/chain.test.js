const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('chain', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat metrics chain --project ethers.js')
  })

  it('shows ethers.js', async function () {
    terminal.has('project_name: ethers.js')
  })
})
