const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('code', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat metrics code --project ethers')
  })

  it('shows stars', async function () {
    const output = terminal.output
    const starsLine = output
      .split('\n')
      .find((line) => line.includes('starCount:'))
    assert(starsLine, 'Stars line not found in terminal output')

    const match = starsLine.match(/starCount:\s(\d+)/)
    assert(match, 'No number found after "stars:"')
  })
})
