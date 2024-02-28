const assert = require('assert')
const { Terminal } = require('common/src/terminal')

describe('interpret', function () {
  const terminal = new Terminal()

  describe('when asked to convert SNX to bytes', function () {
    describe('without prompting', function () {
      before('call interpret', async function () {
        await terminal.run(
          'npx hardhat ai interpret "what is SNX in bytes?" --no-confirm --new-thread --model "gpt-3.5-turbo"',
        )
      })

      it('suggests actions', async function () {
        terminal.has('Suggested Actions')
      })

      it('has an assistant response', async function () {
        terminal.has('Assistant response')
      })

      it('includes the expected output', async function () {
        assert.ok(
          terminal.output.includes(
            '0x534e580000000000000000000000000000000000000000000000000000000000',
          ),
        )
      })
    })

    describe('with prompting', function () {
      before('run interpret', async function () {
        await terminal.run(
          'npx hardhat ai interpret "what is SNX in bytes?" --new-thread --model "gpt-3.5-turbo"',
          10000,
        )
      })

      it('suggests actions', async function () {
        terminal.has('Suggested Actions')
      })

      it('prompts the user for next steps', async function () {
        terminal.has('How would you like to proceed?')
        terminal.has('execute')
        terminal.has('explain')
        terminal.has('skip')
      })

      describe('when the user continues', function () {
        before('press enter', async function () {
          await terminal.input('\r', 10000)
        })

        it('has an assistant response', async function () {
          assert.ok(
            terminal.output.includes('Assistant response'),
            terminal.output,
          )
        })

        it('includes the expected output', async function () {
          assert.ok(
            terminal.output.includes(
              '0x534e580000000000000000000000000000000000000000000000000000000000',
            ),
          )
        })
      })
    })
  })
})
