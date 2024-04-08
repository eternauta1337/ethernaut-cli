const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('metrics', function () {
  const terminal = new Terminal()

  before('run', async function () {
    await terminal.run('hardhat oso metrics ethers.js')
  })

  it('shows stars', async function () {
    const output = terminal.output
    const starsLine = output.split('\n').find((line) => line.includes('Stars:'))
    assert(starsLine, 'Stars line not found in terminal output')

    const match = starsLine.match(/Stars:\s(\d+)/)
    assert(match, 'No number found after "Stars:"')
  })
})
