const assert = require('assert')
const { Terminal, keys } = require('common/src/terminal')

describe('interact unit', function () {
  const terminal = new Terminal()

  describe('when entering unit with all params provided', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit 1 --from ether --to wei', 1000)
    })

    it('contains the word "result"', async function () {
      assert.ok(terminal.output.includes('Result'))
    })

    it('shows the output of unit', async function () {
      assert.ok(terminal.output.includes('1000000000000000000'))
    })
  })

  describe('when entering unit with to missing', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit 1 --from ether', 1000)
    })

    it('does not contain the word "result"', async function () {
      assert.ok(!terminal.output.includes('Result'))
    })

    it('displays the to prompt', async function () {
      assert.ok(terminal.output.includes('Enter to (The unit to convert to)'))
    })

    describe('when entering <to>', function () {
      before('enter wei', async function () {
        await terminal.input('wei\r', 200)
      })

      it('shows the output of unit', async function () {
        assert.ok(terminal.output.includes('1000000000000000000'))
      })
    })
  })

  describe('when entering unit with no params', function () {
    before('run command', async function () {
      await terminal.run('npx hardhat util unit', 1000)
    })

    it('does not contain the word "result"', async function () {
      assert.ok(!terminal.output.includes('Result'))
    })

    it('displays the <value> prompt', async function () {
      assert.ok(terminal.output.includes('Enter value (The value to convert'))
    })

    describe('when entering the value', function () {
      before('enter value', async function () {
        await terminal.input('1\r', 200)
      })

      it('displays the <from> prompt', async function () {
        assert.ok(
          terminal.output.includes('Enter from (The unit to convert from'),
        )
      })

      it('displays the units', async function () {
        assert.ok(terminal.output.includes('ether'))
        assert.ok(terminal.output.includes('wei'))
        assert.ok(terminal.output.includes('kwei'))
        assert.ok(terminal.output.includes('szabo'))
        assert.ok(terminal.output.includes('finney'))
      })

      describe('when autocompleting <from>', function () {
        before('autocomplete for ether', async function () {
          await terminal.input('e', 200)
          await terminal.input('t', 200)
        })

        it('does not display the wei option', async function () {
          assert.ok(!terminal.output.includes('wei'))
        })

        describe('when entering <from>', function () {
          before('press enter', async function () {
            await terminal.input('\r', 200)
          })

          it('displays the <to> prompt', async function () {
            assert.ok(
              terminal.output.includes('Enter to (The unit to convert to'),
            )
          })

          describe('when entering <from>', function () {
            before('enter wei', async function () {
              await terminal.input('wei\r', 200)
            })

            it('shows the output of unit', async function () {
              assert.ok(terminal.output.includes('1000000000000000000'))
            })
          })
        })
      })
    })
  })
})
