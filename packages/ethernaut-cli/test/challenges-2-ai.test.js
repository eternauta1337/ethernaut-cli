const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const getNetwork = require('common/src/network')

describe.skip('completing level 2 of ethernaut with ai', function () {
  const terminal = new Terminal()

  before('check network', async function () {
    if (getNetwork(hre) !== 'sepolia') {
      throw new Error('This test must be run on the sepolia network')
    }
  })

  before('run command', async function () {
    await terminal.run(
      'ethernaut ai interpret "complete level 2 of the ethernaut challenges" --no-confirm --new-thread',
      240000,
    )
  })

  it('completes the level', async function () {
    assert.ok(terminal.output.includes('Level completed'))
  })
})
