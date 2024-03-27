const { Terminal } = require('../../src/test/terminal')

describe('terminal', function () {
  describe('when running a simple command', function () {
    let terminal = new Terminal()

    before('run command', async function () {
      await terminal.run('echo "Hello World"', 1000)
    })

    it('prints hello world', async function () {
      terminal.has('Hello World')
    })
  })
})
