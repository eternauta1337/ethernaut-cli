const assert = require('assert')
const { preParse, getScopesAndTasks } = require('../../src/tasks/pre-parse')

describe('pre-parse', function () {
  describe('getScopesAndTasks', function () {
    let scopesAndTasks

    before('get', async function () {
      scopesAndTasks = getScopesAndTasks(hre)
    })

    it('contains a compile task', async function () {
      assert.ok(scopesAndTasks.taskDefinitions['compile'])
    })

    it('contains a vars scope', async function () {
      assert.ok(scopesAndTasks.scopesDefinitions['vars'])
    })
  })

  describe('preParse', function () {
    let cachedArgv
    let parse

    before('cache argv', async function () {
      cachedArgv = process.argv
    })

    after('restore argv', async function () {
      process.argv = cachedArgv
    })

    describe('with the compile task', function () {
      before('modify argv', async function () {
        process.argv = ['node', 'ethernaut', 'compile']
      })

      before('parse', async function () {
        parse = preParse(hre)
      })

      it('succeeds', async function () {
        assert.ok(parse.success)
      })
    })

    describe('with a task that does not exist', function () {
      before('modify argv', async function () {
        process.argv = ['node', 'ethernaut', 'vars', 'poop']
      })

      before('parse', async function () {
        parse = preParse(hre)
      })

      it('fails', async function () {
        assert.ok(!parse.success)
      })
    })

    describe('with nonsense', function () {
      before('modify argv', async function () {
        process.argv = ['node', 'what', 'time', 'is', 'it']
      })

      before('parse', async function () {
        parse = preParse(hre)
      })

      it('fails', async function () {
        assert.ok(!parse.success)
      })
    })
  })
})
