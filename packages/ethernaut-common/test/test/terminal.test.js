const { Terminal } = require('../../src/test/terminal')
const hardhat = require('hardhat')

describe('terminal', function () {
  describe('when running a simple command', function () {
    let terminal = new Terminal()

    before('run command', async function () {
      await terminal.run('hardhat --version', 1000)
    })

    it('shows hardhat version', async function () {
      terminal.has(hardhat.version)
    })
  })
})
