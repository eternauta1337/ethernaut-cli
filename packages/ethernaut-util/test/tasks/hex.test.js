const assert = require('assert')

describe('hex', function () {
  it('converts "42" to hex', async function () {
    assert.equal(
      await hre.run({ scope: 'util', task: 'hex' }, { value: '42' }),
      '0x2a',
    )
  })
})
