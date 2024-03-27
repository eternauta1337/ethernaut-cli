const assert = require('assert')
const getNodes = require('../../src/tasks/get-nodes')
const flattenTasks = require('../../src/tasks/flatten')

describe('flatten', function () {
  describe('flattenTasks', function () {
    describe('when flattening the default hre tasks', function () {
      let flattened

      before('flatten', async function () {
        const nodes = getNodes(hre)
        flattened = flattenTasks(nodes)
      })

      it('contains a compile task', async function () {
        assert.ok(flattened.some((node) => node.name === 'compile'))
      })

      it('contains a setup task (from the vars scope)', async function () {
        assert.ok(flattened.some((node) => node.name === 'setup'))
      })
    })
  })
})
