const assert = require('assert')

describe('wait', function () {
  let wait

  before('load module', async function () {
    wait = require('../../src/util/wait')
  })

  it('waits the correct time', async function () {
    const start = Date.now()
    await wait(100)
    const end = Date.now()
    assert.ok(end - start >= 100)
  })
})
