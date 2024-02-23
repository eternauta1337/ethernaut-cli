const assert = require('assert')
const hre = require('hardhat')

describe('ai', function () {
  it('has an "ai" scope', async function () {
    assert.notEqual(hre.scopes['ai'], undefined)
  })
})
