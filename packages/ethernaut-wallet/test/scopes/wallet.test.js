const assert = require('assert')

describe('wallet', function () {
  it('has a "wallet" scope', async function () {
    assert.notEqual(hre.scopes['wallet'], undefined)
  })
})
