const assert = require('assert')
const {
  address,
  bytes,
  bytes32,
  ens,
  int,
  string,
} = require('../../src/validation/types')

describe('types', function () {
  describe('address', function () {
    it('validates a proper address', async function () {
      assert.ok(
        address.validate(
          'address',
          '0x1234567890123456789012345678901234567890',
        ),
      )
    })

    it('throws with an invalid address', async function () {
      try {
        address.validate('address', '0x1234')
      } catch (err) {
        assert.equal(err.message, 'Invalid address 0x1234')
      }
    })
  })

  describe('bytes', function () {
    it('validates a proper value', async function () {
      assert.ok(bytes.validate('bytes', '0x1234'))
    })

    it('throws with an invalid value', async function () {
      try {
        bytes.validate('bytes', 'poop')
      } catch (err) {
        assert.equal(err.message, 'Invalid bytes: poop')
      }
    })
  })

  describe('bytes32', function () {
    it('validates a proper value', async function () {
      assert.ok(
        bytes32.validate(
          'bytes32',
          '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        ),
      )
    })

    it('throws with an invalid value', async function () {
      try {
        bytes32.validate(
          'bytes32',
          '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
        )
      } catch (err) {
        assert.equal(
          err.message,
          'Invalid bytes: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
        )
      }
    })
  })

  describe('ens', function () {
    it('validates a proper value', async function () {
      assert.ok(ens.validate('ens', 'vitalik.eth'))
    })

    it('throws with an invalid value', async function () {
      try {
        ens.validate('ens', 'poop')
      } catch (err) {
        assert.equal(err.message, 'Invalid ens: poop')
      }
    })
  })

  describe('int', function () {
    it('validates a proper value', async function () {
      assert.ok(int.validate('int', '1'))
    })

    it('throws with an invalid value', async function () {
      try {
        int.validate('int', 'poop')
      } catch (err) {
        assert.equal(
          err.message,
          'HH301: Invalid value NaN for argument int of type int',
        )
      }
    })
  })

  describe('string', function () {
    it('validates a proper value', async function () {
      assert.ok(string.validate('string', 'hello'))
    })

    it('throws with an invalid value', async function () {
      try {
        string.validate('string', 1)
      } catch (err) {
        assert.equal(
          err.message,
          'HH301: Invalid value 1 for argument string of type string',
        )
      }
    })
  })
})
