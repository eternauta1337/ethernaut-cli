const assert = require('assert')
const toCliSyntax = require('../../src/ui/syntax')
const { scope } = require('hardhat/config')

describe('syntax', function () {
  describe('toCliSyntax', function () {
    let s, t

    describe('with a simple task', function () {
      s = scope('myScope', 'desc')
      t = s
        .task('myTask', 'desc')
        .addParam('param', 'desc')
        .addFlag('flag', 'desc')
        .addFlag('anotherFlag', 'desc')
        .addPositionalParam('pParam', 'desc')
    })

    it('produces the expected syntax', async function () {
      assert.equal(
        toCliSyntax(t, {
          pParam: '42',
          param: 'pup to be',
          flag: false,
          anotherFlag: true,
        }),
        // eslint-disable-next-line quotes
        "ethernaut myScope myTask 42 --param 'pup to be' --another-flag",
      )
    })

    describe('with an invalid param', function () {
      it('throws the expected error', async function () {
        let message =
          'No definition found for parameter wrongParam, and task myTask, with args {\n'
        message += '  "wrongParam": "poop"\n'
        message += '}'
        assert.throws(
          () => {
            toCliSyntax(t, { wrongParam: 'poop' })
          },
          {
            name: 'EthernautCliError',
            message,
          },
        )
      })
    })
  })
})
