const assert = require('assert')
const { findLineWith } = require('../../src/util/strings')

describe('strings', function () {
  describe('findLineWith', function () {
    let txt

    before('prepare text', async function () {
      txt = 'Line 1 is first\n'
      txt += 'Line 2 is second\n'
      txt += 'Line 3 is third'
    })

    it('finds line 2', async function () {
      assert.equal(findLineWith('Line 2', txt), 'is second')
    })
  })
})
