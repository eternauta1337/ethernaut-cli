const assert = require('assert')
const clipboard = require('../../src/util/clipboard')
const { paste } = require('copy-paste')

describe('clipboard', function () {
  describe('when copying to clipboard', function () {
    let str = 'testing123'
    before('copy', async function () {
      clipboard(str)
    })

    it('pastes the same content', async function () {
      assert.equal(paste(), str)
    })
  })
})
