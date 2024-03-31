const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('config ui', function () {
  const terminal = new Terminal()

  describe('when config is called with no params', function () {
    before('call', async function () {
      await terminal.run('npx nyc hardhat ai config', 2000)
    })

    it('displays gpt models', async function () {
      terminal.has('gpt-')
    })
  })
})
