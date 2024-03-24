const assert = require('assert')
const { isUrl } = require('../../src/util/url')

describe('url', function () {
  describe('isUrl', function () {
    it('identifies a proper url', async function () {
      assert.ok(isUrl('http://www.google.com'))
    })

    it('identifies non url', async function () {
      assert.ok(!isUrl('www.google.com'))
    })
  })
})
