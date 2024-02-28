const assert = require('assert')

describe('sig', function () {
  it('has an "sig" scope', async function () {
    assert.notEqual(hre.scopes['sig'], undefined)
  })
})
