const assert = require('assert')

describe('bytes', function () {
  it('converts "hello" to bytes', async function () {
    assert.equal(
      await hre.run({ scope: 'util', task: 'bytes' }, { value: 'hello' }),
      '0x68656c6c6f000000000000000000000000000000000000000000000000000000',
    )
  })

  it('converts "42" to bytes', async function () {
    assert.equal(
      await hre.run({ scope: 'util', task: 'bytes' }, { value: '42' }),
      '0x3432000000000000000000000000000000000000000000000000000000000000',
    )
  })

  it('converts "" to bytes', async function () {
    assert.equal(
      await hre.run({ scope: 'util', task: 'bytes' }, { value: '' }),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    )
  })
})
