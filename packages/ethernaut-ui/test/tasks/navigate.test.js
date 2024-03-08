const assert = require('assert')
const { Terminal, keys } = require('ethernaut-common/src/terminal')
const { findLineWith } = require('ethernaut-common/src/strings')

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
        'Simple, everyday utilities for Ethereum devs',
      )
    })

    it('displays the console task', async function () {
      assert.equal(
        findLineWith('console', terminal.output),
        'Opens a hardhat console',
      )
    })

    describe('when using the arrow keys to navigate to the util package', function () {
      before('interact', async function () {
        await terminal.input('util\r', 1000)
      })

      it('shows that util was picked', async function () {
        terminal.has('Pick a task or scope · util')
      })

      it('shows the up nav', async function () {
        terminal.has('up')
      })

      it('shows utils', async function () {
        terminal.has('bytes')
        terminal.has('string')
        terminal.has('unit')
      })

      describe('when selecting up', function () {
        before('interact', async function () {
          await terminal.input(keys.ENTER, 200)
        })

        it('does not show utils', async function () {
          terminal.notHas('bytes')
          terminal.notHas('string')
          terminal.notHas('unit')
        })

        describe('when navigating to utils with autocomplete', function () {
          before('interact', async function () {
            await terminal.input('util\r', 200)
          })

          it('shows utils', async function () {
            terminal.has('bytes')
            terminal.has('string')
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
              terminal.notHas('bytes')
              terminal.notHas('string')
            })

            describe('when continuing to autocomplete', function () {
              before('type n', async function () {
                await terminal.input('n', 200)
              })

              it('doesnt show the up nav', async function () {
                terminal.notHas('up')
              })

              it('shows the unit util', async function () {
                terminal.has('unit')
              })

              describe('when selecting the unit util', function () {
                before('press enter', async function () {
                  await terminal.input(keys.ENTER, 1000)
                })

                it('displays a prompt for entering the value to convert', async function () {
                  terminal.has('Enter value (The value to convert)')
                })
              })
            })
          })
        })
      })
    })
  })
})
