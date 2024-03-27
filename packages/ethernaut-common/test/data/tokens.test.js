const assert = require('assert')
const tokens = require('../../src/data/tokens')

describe('tokens', function () {
  let token

  describe('$BASED token', function () {
    before('', async function () {
      token = tokens.tokens.find((t) => t.symbol === '$BASED')
    })

    it('found the entry', async function () {
      assert.ok(token)
    })

    it('has the correct name', async function () {
      assert.equal(token.name, 'Based Money')
    })
  })
})
