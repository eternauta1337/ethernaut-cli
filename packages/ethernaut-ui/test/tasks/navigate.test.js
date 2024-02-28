const assert = require('assert')
const { Terminal, keys } = require('common/src/terminal')
const { findLineWith } = require('common/src/strings')

describe('navigate', function () {
  const terminal = new Terminal()

  describe('when entering navigation', function () {
    before('run navigate', async function () {
      await terminal.run('npx hardhat navigate', 1000)
    })

    it('displays the main prompt', async function () {
      terminal.has('Pick a task or scope')
    })

    it('displays the util scope', async function () {
      assert.equal(
        findLineWith('[util]', terminal.output),
        'A collection of tools for the Ethernaut CLI',
      )
    })

    it('displays the compile task', async function () {
      assert.equal(
        findLineWith('compile', terminal.output),
        'Compiles the entire project, building all artifacts',
      )
    })

    describe('when using the arrow keys to navigate to the util package', function () {
      before('interact', async function () {
        await terminal.input(keys.DOWN, 100)
        await terminal.input(keys.DOWN, 100)
        await terminal.input(keys.ENTER, 1000)
      })

      it('shows that util was picked', async function () {
        terminal.has('Pick a task or scope · util')
      })

      it('shows the up nav', async function () {
        terminal.has('up')
      })

      it('shows utils', async function () {
        terminal.has('to-bytes')
        terminal.has('to-string')
        terminal.has('unit')
      })

      describe('when selecting up', function () {
        before('interact', async function () {
          await terminal.input(keys.ENTER, 200)
        })

        it('does not show utils', async function () {
          assert.ok(!terminal.output.includes('to-bytes'), terminal.output)
          assert.ok(!terminal.output.includes('to-string'), terminal.output)
          assert.ok(!terminal.output.includes('unit'), terminal.output)
        })

        describe('when navigating to utils with autocomplete', function () {
          before('interact', async function () {
            await terminal.input('util\r', 200)
          })

          it('shows utils', async function () {
            terminal.has('to-bytes')
            terminal.has('to-string')
            terminal.has('unit')
          })

          describe('when autocompleting for the unit util', function () {
            before('type u', async function () {
              await terminal.input('u', 200)
            })

            it('shows the up nav', async function () {
              terminal.has('up')
            })

            it('shows the unit util', async function () {
              terminal.has('unit')
            })

            it('doesnt show the other utils', async function () {
              assert.ok(!terminal.output.includes('to-bytes'), terminal.output)
              assert.ok(!terminal.output.includes('to-string'), terminal.output)
            })

            describe('when continuing to autocomplete', function () {
              before('type n', async function () {
                await terminal.input('n', 200)
              })

              it('doesnt show the up nav', async function () {
                assert.ok(!terminal.output.includes('up'), terminal.output)
              })

              it('shows the unit util', async function () {
                terminal.has('unit')
              })

              describe('when selecting the unit util', function () {
                before('press enter', async function () {
                  await terminal.input(keys.ENTER, 500)
                })

                it('displays a prompt for entering the value to convert', async function () {
                  assert.ok(
                    terminal.output.includes(
                      'Enter value (The value to convert)',
                    ),
                  )
                })
              })
            })
          })
        })
      })
    })
  })
})
