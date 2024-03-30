const assert = require('assert')
const { almostEqual } = require('../../src/util/math')

describe('wait', function () {
  let wait

  before('load module', async function () {
    wait = require('../../src/util/wait')
  })

  it('waits the correct time', async function () {
    const ms = 1000
    const start = Date.now()
    await wait(ms)
    const end = Date.now()
    assert.ok(almostEqual(end - start, ms, 100))
  })
})
