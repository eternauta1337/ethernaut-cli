const assert = require('assert')

describe('challenges', function () {
  it('has an "challenges" scope', async function () {
    assert.notEqual(hre.scopes['challenges'], undefined)
  })
})
