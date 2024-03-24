const assert = require('assert')
const { isBytes32, isBytes } = require('../../src/util/bytes')

describe('bytes', function () {
  describe('isBytes32', function () {
    it('identifies a correct bytes32 value', async function () {
      assert.ok(
        isBytes32(
          '0x1234567890123456789012345678901234567890123456789012345678901234',
        ),
      )
    })

    it('detects when a value is too short', async function () {
      assert.ok(!isBytes32('0x123456789'))
    })

    it('detects nonsense', async function () {
      assert.ok(!isBytes32('poop'))
    })
  })

  describe('isBytes', function () {
    it('identifies a correct bytes32 value', async function () {
      assert.ok(
        isBytes(
          '0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        ),
      )
    })

    it('detects nonsense', async function () {
      assert.ok(!isBytes('poop'))
    })
  })
})
