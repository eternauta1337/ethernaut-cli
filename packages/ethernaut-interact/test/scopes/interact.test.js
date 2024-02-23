const assert = require('assert')
const hre = require('hardhat')

describe('interact', function () {
  it('has an "interact" scope', async function () {
    assert.notEqual(hre.scopes['interact'], undefined)
  })
})
