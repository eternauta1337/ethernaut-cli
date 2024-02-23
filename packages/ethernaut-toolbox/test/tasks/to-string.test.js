const assert = require('assert')
const hre = require('hardhat')

describe('to-string', function () {
  it('converts "hello" from bytes', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'to-string' },
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
        { scope: 'util', task: 'to-string' },
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
        { scope: 'util', task: 'to-string' },
        {
          value:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      ),
      '',
    )
  })

  it('shows an error message when an invalid bytes value is passed', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'to-string' },
        {
          value: 'abc',
        },
      ),
      'invalid BytesLike value (argument="bytes", value="abc", code=INVALID_ARGUMENT, version=6.11.1)',
    )
  })
})
