const { Terminal } = require('common/src/terminal')

describe('interact unit', function () {
  const terminal = new Terminal()

  describe('when entering unit with all params provided', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit 1 --from ether --to wei')
    })

    it('contains the word "result"', async function () {
      console.log('>>>> COMEON')
      terminal.has('Result')
      process.exit(0)
    })

    it('shows the output of unit', async function () {
      terminal.has('1000000000000000000')
    })
  })

  describe('when entering unit with to missing', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit 1 --from ether', 1000)
    })

    it('does not contain the word "result"', async function () {
      terminal.notHas('Result')
    })

    it('displays the to prompt', async function () {
      terminal.has('Enter to (The unit to convert to)')
    })

    describe('when entering <to>', function () {
      before('enter wei', async function () {
        await terminal.input('wei\r', 200)
      })

      it('shows the output of unit', async function () {
        terminal.has('1000000000000000000')
      })
    })
  })

  describe('when entering unit with no params', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit', 1000)
    })

    it('does not contain the word "result"', async function () {
      terminal.notHas('Result')
    })

    it('displays the <value> prompt', async function () {
      terminal.has('Enter value (The value to convert')
    })

    describe('when entering the value', function () {
      before('enter value', async function () {
        await terminal.input('1\r', 200)
      })

      it('displays the <from> prompt', async function () {
        terminal.has('Enter from (The unit to convert from')
      })

      it('displays the units', async function () {
        terminal.has('ether')
        terminal.has('wei')
        terminal.has('kwei')
        terminal.has('szabo')
        terminal.has('finney')
      })

      describe('when autocompleting <from>', function () {
        before('autocomplete for ether', async function () {
          await terminal.input('e', 200)
          await terminal.input('t', 200)
        })

        it('does not display the wei option', async function () {
          terminal.notHas('wei')
        })

        describe('when entering <from>', function () {
          before('press enter', async function () {
            await terminal.input('\r', 200)
          })

          it('displays the <to> prompt', async function () {
            terminal.has('Enter to (The unit to convert to')
          })

          describe('when entering <from>', function () {
            before('enter wei', async function () {
              await terminal.input('wei\r', 200)
            })

            it('shows the output of unit', async function () {
              terminal.has('1000000000000000000')
            })
          })
        })
      })
    })
  })
})
