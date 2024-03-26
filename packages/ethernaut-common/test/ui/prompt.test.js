const assert = require('assert')
const { prompt, hidePrompts } = require('../../src/ui/prompt')
const wait = require('../../src/util/wait')

// Note: Testing these prompts is a hard.
// The prompt function returns a promise with the response from the user.
// It simply awaits the users interaction.
// Here, we don't await it and use the callback function to get the result.
// We also use the onPrompt callback to get the prompt object, which we interact with.
// An additional complexity is that the prompt function queues multiple prompts.
// I.e. it can receive a request for a prompt while another one is active.

describe('prompt', function () {
  describe('confirm prompt', function () {
    let prompt1
    let result

    before('create prompt', async function () {
      prompt({
        type: 'confirm',
        message: 'Are you sure?',
        show: false,
        callback: (r) => (result = r),
        onPrompt: (p) => (prompt1 = p),
      })
      // Wait a little bit for onPrompt to trigger
      await wait(100)
    })

    before('interact', async function () {
      await prompt1.keypress('y')
      await prompt1.submit()
    })

    it('collected result', async function () {
      assert.ok(result)
    })
  })

  describe('multiple prompts', function () {
    let prompt1, prompt2
    let result1, result2

    before('create prompts', async function () {
      prompt({
        type: 'confirm',
        message: 'Are you real?',
        show: false,
        callback: (r) => (result1 = r),
        onPrompt: (p) => (prompt1 = p),
      })
      prompt({
        type: 'input',
        message: 'How old are you?',
        show: false,
        callback: (r) => (result2 = r),
        onPrompt: (p) => (prompt2 = p),
      })
    })

    describe('when interacting with the first prompt and hiding the rest', function () {
      before('hide incoming prompt', async function () {
        hidePrompts()
      })

      before('interact', async function () {
        await prompt1.keypress('y')
        await prompt1.submit()
      })

      it('collected result 1', async function () {
        assert.ok(result1)
      })

      describe('when interacting with the second prompt', function () {
        before('interact', async function () {
          await prompt2.keypress('4')
          await prompt2.keypress('2')
          await prompt2.submit()
        })

        it('collected result 2', async function () {
          assert.equal(result2, '42')
        })
      })
    })
  })
})
