const assert = require('assert')
const { scope } = require('hardhat/config')
const getTaskUsage = require('../../src/tasks/usage')
const types = require('../../src/validation/types')

describe('usage', function () {
  describe('getTaskUsage', function () {
    describe('with a simple task', function () {
      let s, t
      let usage

      before('create task', async function () {
        s = scope('myScope', 'desc')
        t = s
          .task('myTask1', 'desc')
          .addParam('param', 'desc', undefined, types.bytes)
          .addFlag('flag', 'desc')
          .addFlag('anotherFlag', 'desc')
          .addPositionalParam('pParam', 'desc', undefined, types.int)
      })

      before('get usage', async function () {
        usage = getTaskUsage(t)
      })

      it('produces the expected usage', async function () {
        assert.equal(
          usage,
          'myScope myTask1 [--another-flag] [--flag] --param <BYTES> pParam <INT>',
        )
      })
    })
  })
})
