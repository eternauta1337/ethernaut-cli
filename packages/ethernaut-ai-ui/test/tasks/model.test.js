const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('model ui', function () {
  const terminal = new Terminal()

  describe('when model is called with no params', function () {
    before('call', async function () {
      await terminal.run('hardhat ai model', 2000)
    })

    it('displays gpt models', async function () {
      terminal.has('gpt-')
    })
  })
})
