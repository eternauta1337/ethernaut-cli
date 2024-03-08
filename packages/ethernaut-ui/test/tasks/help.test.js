const { Terminal } = require('ethernaut-common/src/terminal')

describe('help', function () {
  const terminal = new Terminal()

  describe('when entering the cli with no arguments', function () {
    before('run hardhat', async function () {
      await terminal.run('npx hardhat', 2000)
    })

    it('displays the main prompt', async function () {
      terminal.has('Pick a task or scope')
    })

    it('displays the util scope', async function () {
      terminal.has('[util]')
    })

    it('does not display the vars scope', async function () {
      terminal.notHas('[vars]')
    })
  })

  describe('when entering the cli with the --help option or task', function () {
    const itShowsHelp = function () {
      it('does not show navigation', async function () {
        terminal.notHas('?')
      })

      it('shows help', async function () {
        terminal.has('Hardhat version')
      })
    }

    describe('with the explicit help task', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat help')
      })

      itShowsHelp()

      it('shows the non interactive flag', async function () {
        terminal.has('--non-interactive')
      })
    })

    describe('with no scope or task', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat --help')
      })

      itShowsHelp()

      it('shows the non interactive flag', async function () {
        terminal.has('--non-interactive')
      })
    })

    describe('with a scope', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat util --help')
      })

      itShowsHelp()
    })

    describe('with a task', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat util unit --help')
      })

      itShowsHelp()
    })
  })
})
