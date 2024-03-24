const assert = require('assert')
const { almostEqual } = require('../../src/util/math')

describe('math', function () {
  describe('almostEqual', function () {
    it('shows expected values', async function () {
      assert.ok(almostEqual(1, 1))
      assert.ok(almostEqual(1, 0.999))
      assert.ok(almostEqual(1, 0.98, 0.021))
    })
  })
})
