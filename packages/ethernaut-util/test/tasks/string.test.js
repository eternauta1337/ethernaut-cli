const assert = require('assert')

describe('string', function () {
  it('converts "hello" from bytes', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'string' },
        {
          value:
            '0x68656c6c6f000000000000000000000000000000000000000000000000000000',
        },
      ),
      'hello',
    )
  })

  it('converts "42" from bytes', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'string' },
        {
          value:
            '0x3432000000000000000000000000000000000000000000000000000000000000',
        },
      ),
      '42',
    )
  })

  it('converts "" from bytes', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'string' },
        {
          value:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      ),
      '',
    )
  })

  it('shows an error message when an invalid bytes value is passed', async function () {
    let error
    try {
      await hre.run(
        { scope: 'util', task: 'string' },
        {
          value: 'abc',
        },
      )
    } catch (err) {
      error = err.message
    }
    assert.ok(error.includes('Invalid bytes'), error)
  })
})
