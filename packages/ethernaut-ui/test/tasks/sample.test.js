const { Terminal } = require('common/src/terminal')

describe('sample task', function () {
  const terminal = new Terminal()

  describe('when a default value is passed explicitely', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample "default-value"', 1000)
    })

    it('displays the result', async function () {
      terminal.has('Sample task: default-value')
    })
  })

  describe('when parameters are passed', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample poop', 1000)
    })

    it('displays the result', async function () {
      terminal.has('Sample task: poop')
    })
  })

  describe('when no parameters are passed', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample', 1000)
    })

    it('Asks for param with default value', async function () {
      terminal.has('? Enter param (Sample param): › default-value')
    })

    describe('when the user enters a value', function () {
      before('enter value', async function () {
        await terminal.input('poop\n')
      })

      it('displays the result', async function () {
        terminal.has('Sample task: poop')
      })
    })
  })
})
