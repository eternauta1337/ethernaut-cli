const assert = require('assert')
const hre = require('hardhat')

describe('util', function () {
  it('has a "util" scope', async function () {
    assert.notEqual(hre.scopes['util'], undefined)
  })
})
