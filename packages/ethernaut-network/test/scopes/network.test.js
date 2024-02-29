const assert = require('assert')

describe('network', function () {
  it('has an "network" scope', async function () {
    assert.notEqual(hre.scopes['network'], undefined)
  })
})
