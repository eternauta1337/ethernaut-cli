const { Terminal } = require('ethernaut-common/src/test/terminal')

// Note: The sample task is defined in the fixture project at packages/ethernaut-ui/test/fixture-projects/basic-project/hardhat.config.js

describe('sample task', function () {
  const terminal = new Terminal()

  describe('when calling the tasks help', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample --help', 1000)
    })

    it('shows Usage', async function () {
      terminal.has('Usage:')
    })

    it('shows param', async function () {
      terminal.has('Sample param')
    })
  })

  describe('when using --non-interactive', function () {
    before('call sample without the required value', async function () {
      await terminal.run('npx hardhat sample --non-interactive', 1000)
    })

    it('prints default-value', async function () {
      terminal.has('Sample task: default-value')
    })
  })

  describe('when a default value is passed explicitly', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample "default-value" --num 42', 1000)
    })

    it('displays the result', async function () {
      terminal.has('Sample task: default-value')
    })
  })

  describe('when parameters are passed', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample poop --num 42', 1000)
    })

    it('displays the result', async function () {
      terminal.has('Sample task: poop')
    })
  })

  describe('when the user enters an invalid number', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample poop', 1000)
    })

    it('Asks for num with default value', async function () {
      terminal.has('? Enter the number')
      terminal.has('43')
    })

    describe('when the user enters an invalid value', function () {
      before('enter invalid value', async function () {
        await terminal.input('poop\n')
      })

      it('displays an error', async function () {
        terminal.has('Invalid value NaN for argument num of type int')
      })
    })
  })

  describe('when no parameters are passed', function () {
    before('call', async function () {
      await terminal.run('npx hardhat sample', 1000)
    })

    it('Asks for param with default value', async function () {
      terminal.has('? Enter param (Sample param):')
      terminal.has('default-value')
    })

    describe('when the user enters a value', function () {
      before('enter value', async function () {
        await terminal.input('poop\n')
      })

      it('Asks for num with default value', async function () {
        terminal.has('? Enter the number')
        terminal.has('43')
      })

      describe('when the user enters a value', function () {
        before('enter valid value', async function () {
          await terminal.input('42\n')
        })

        it('displays the result', async function () {
          terminal.has('Sample task: poop')
        })
      })
    })
  })
})
