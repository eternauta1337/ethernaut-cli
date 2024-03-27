const path = require('path')
const assert = require('assert')
const isValidJsonFile = require('../../src/io/json')

describe('json', function () {
  describe('isValidJsonFile', function () {
    it('returns false for a .sol extension', async function () {
      assert.ok(!isValidJsonFile('MyContract.sol'))
    })

    it('returns false for a file that does not exist', async function () {
      assert.ok(!isValidJsonFile('MyABI.json'))
    })

    it('returns true for a valid file', async function () {
      const p = path.resolve(
        __dirname,
        '../../../ethernaut-interact/src/abis/erc20.json',
      )
      assert.ok(isValidJsonFile(p))
    })
  })
})
