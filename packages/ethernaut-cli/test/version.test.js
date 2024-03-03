const { version } = require('../package.json')
const { Terminal } = require('common/src/terminal')

describe('version', function () {
  const terminal = new Terminal()

  describe('when calling any command', function () {
    before('call', async function () {
      await terminal.run('npx hardhat util unit 1 from --ether to --wei')
    })

    it('shows version', async function () {
      terminal.has(`v${version}`)
    })
  })
})
