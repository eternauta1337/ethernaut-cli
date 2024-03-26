const assert = require('assert')
const { browseAt, getPrompt } = require('../../src/ui/browse')
const wait = require('../../src/util/wait')

describe('browse', function () {
  let prompt

  before('open browser', async function () {
    browseAt(process.cwd(), true)
    await wait(100)
    prompt = getPrompt()
  })

  after('close browser', async function () {
    prompt.close()
  })

  it('shows choices', async function () {
    assert.ok(prompt.choices.length > 0)
  })

  describe('when navigating', function () {
    before('nav', async function () {
      prompt.keypress(null, { name: 'down' })
      prompt.keypress(null, { name: 'return' })
      await wait(100)
    })

    it('shows choices', async function () {
      assert.ok(prompt.choices.length > 0)
    })
  })
})
