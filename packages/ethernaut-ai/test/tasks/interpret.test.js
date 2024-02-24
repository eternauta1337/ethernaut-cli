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
        assert.ok(terminal.output.includes('Suggested Actions'))
      })

      it('has an assistant response', async function () {
        assert.ok(terminal.output.includes('Assistant response'))
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
        assert.ok(terminal.output.includes('Suggested Actions'))
      })

      it('prompts the user for next steps', async function () {
        assert.ok(terminal.output.includes('How would you like to proceed?'))
        assert.ok(terminal.output.includes('execute'))
        assert.ok(terminal.output.includes('explain'))
        assert.ok(terminal.output.includes('skip'))
      })

      describe('when the user continues', function () {
        before('press enter', async function () {
          await terminal.input('\r', 10000)
        })

        it('has an assistant response', async function () {
          assert.ok(terminal.output.includes('Assistant response'))
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
