const assert = require('assert')
const hashStr = require('../../src/util/hash-str')

describe('hash-str', function () {
  it('properly hashes "hello"', async function () {
    assert.equal(
      hashStr('hello'),
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    )
  })
})
