const assert = require('assert')

describe('scopes', function () {
  it('has an "ai" scope', async function () {
    assert.notEqual(hre.scopes['ai'], undefined)
  })

  it('has an "interact" scope', async function () {
    assert.notEqual(hre.scopes['interact'], undefined)
  })

  it('has a "util" scope', async function () {
    assert.notEqual(hre.scopes['util'], undefined)
  })

  it('has a "challenges" scope', async function () {
    assert.notEqual(hre.scopes['challenges'], undefined)
  })

  it('doesnt have a "vars" scope', async function () {
    assert.equal(hre.scopes['vars'], undefined)
  })

  it('doesnt have a "poop" scope', async function () {
    assert.equal(hre.scopes['poop'], undefined)
  })
})
