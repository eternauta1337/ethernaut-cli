const assert = require('assert')
const getNodes = require('../../src/tasks/get-nodes')

describe('get-nodes', function () {
  describe('getNodes', function () {
    let nodes

    before('get hre nodes', async function () {
      nodes = getNodes(hre)
    })

    it('does not contain a poop task', async function () {
      assert.ok(!nodes.some((node) => node.name === 'poop'))
    })

    it('contains a compile task', async function () {
      assert.ok(nodes.some((node) => node.name === 'compile'))
    })

    it('contains a vars scope', async function () {
      const vars = nodes.find((node) => node.name === 'vars')
      assert.ok(vars !== undefined)
      assert.ok(vars.isScope)
    })
  })
})
