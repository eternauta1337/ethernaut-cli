const assert = require('assert')
const spinner = require('ethernaut-common/src/ui/spinner')

describe('spinner', function () {
  before('enable spinners', async function () {
    spinner.enable(true)
    spinner.mute(false)
  })

  describe('simple spinner', function () {
    let spinnie
    const channel = 'test'
    const msg = 'This is a test message'

    describe('that succeeds', function () {
      before('create the spinner', async function () {
        spinnie = spinner.progress(msg, channel)
      })

      it('displays the message', async function () {
        assert.equal(spinnie.text, msg)
      })

      describe('when succeeding the spinner', function () {
        before('succeed', async function () {
          spinner.success('Done', channel)
        })

        it('does not throw', async function () {})

        describe('when removing the spinner', function () {
          before('remove', async function () {
            spinner.remove(channel)
          })

          it('does not throw', async function () {})
        })
      })
    })

    describe('that fails', function () {
      before('create the spinner', async function () {
        spinnie = spinner.progress(msg, channel)
      })

      it('displays the message', async function () {
        assert.equal(spinnie.text, msg)
      })

      describe('when failing the spinner', function () {
        before('failing', async function () {
          spinner.fail('Failed', channel)
        })

        it('does not throw', async function () {})
      })
    })

    describe('that is stopped', function () {
      before('create the spinner', async function () {
        spinnie = spinner.progress(msg, channel)
      })

      it('displays the message', async function () {
        assert.equal(spinnie.text, msg)
      })

      describe('when stopping all spinners', function () {
        before('stop', async function () {
          spinner.stop()
        })

        it('does not throw', async function () {})
      })
    })
  })
})
