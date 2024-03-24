const assert = require('assert')
const { validateVarName } = require('../../src/util/name')

describe('name', function () {
  describe('validateVarName', function () {
    it('validates myVarName', async function () {
      assert.ok(validateVarName('myVarName'))
    })

    it('invalidates poop is cold', async function () {
      assert.ok(!validateVarName('poop is cold'))
    })
  })
})
