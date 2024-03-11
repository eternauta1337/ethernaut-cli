const assert = require('assert')

describe('checksum', function () {
  it('calculates the checksum of an all lowercase address', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'checksum' },
        {
          address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        },
      ),
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    )
  })

  it('throws when a bad checksum is provided', async function () {
    const output = await hre.run(
      { scope: 'util', task: 'checksum' },
      {
        address: '0xf39fd6e51aad88f6f4ce6ab8827279cffFb92266',
      },
    )
    assert.ok(output.includes('bad address checksum'))
  })
})
