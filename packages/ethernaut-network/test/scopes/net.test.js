const assert = require('assert')

describe('net', function () {
  it('has an "net" scope', async function () {
    assert.notEqual(hre.scopes['net'], undefined)
  })
})
