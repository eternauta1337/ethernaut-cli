const assert = require('assert')

describe('interact', function () {
  it('has an "interact" scope', async function () {
    assert.notEqual(hre.scopes['interact'], undefined)
  })
})
