const assert = require('assert')
const { Terminal } = require('common/src/terminal')

describe('help', function () {
  const terminal = new Terminal()

  describe('when entering the cli with no arguments', function () {
    before('run hardhat', async function () {
      await terminal.run('npx hardhat', 2000)
    })

    it('displays the main prompt', async function () {
      assert.ok(
        terminal.output.includes('Pick a task or scope'),
        terminal.output,
      )
    })

    it('displays the util scope', async function () {
      assert.ok(terminal.output.includes('[util]'), terminal.output)
    })
  })

  describe('when entering the cli with the --help option or task', function () {
    const itShowsHelp = function () {
      it('does not show navigation', async function () {
        assert.ok(!terminal.output.includes('?'), terminal.output)
      })

      it('shows help', async function () {
        assert.ok(
          terminal.output.includes('Hardhat version'),
          terminal.output,
          terminal.output,
        )
      })
    }

    describe('with the explicit help task', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat help')
      })

      itShowsHelp()
    })

    describe('with no scope or task', function () {
      before('run command', async function () {
        await terminal.run('npx hardhat --help')
      })

      itShowsHelp()
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
