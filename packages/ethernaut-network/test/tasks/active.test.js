const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('active', function () {
  let activeNetwork
  const terminal = new Terminal()

  before('get the active network', async function () {
    activeNetwork = storage.readNetworks().activeNetwork
  })

  describe('when calling active task', function () {
    before('call task', async function () {
      await terminal.run('npx hardhat net active')
    })

    it('prints the active network', async function () {
      assert.ok(
        terminal.output.includes(`The active network is "${activeNetwork}"`),
        terminal.output,
      )
    })
  })
})
