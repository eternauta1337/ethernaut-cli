const assert = require('assert')
const hre = require('hardhat')

describe('oz', function () {
  it('has an "oz" scope', async function () {
    assert.notEqual(hre.scopes['oz'], undefined)
  })
})
