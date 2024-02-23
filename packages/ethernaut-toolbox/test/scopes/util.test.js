const assert = require('assert')

describe('util', function () {
  it('has a "util" scope', async function () {
    assert.notEqual(hre.scopes['util'], undefined)
  })
})
