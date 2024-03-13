const assert = require('assert')

describe('unit', function () {
  it('converts 1 ether to wei', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'unit' },
        {
          value: '1',
          from: 'ether',
          to: 'wei',
        },
      ),
      '1000000000000000000',
    )
  })

  it('converts 1 wei to ether', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'unit' },
        {
          value: '1',
          from: 'wei',
          to: 'ether',
        },
      ),
      '0.000000000000000001',
    )
  })

  it('converts to 6 decimals', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'unit' },
        {
          value: '6500000000',
          from: 'wei',
          to: '6',
        },
      ),
      '6500',
    )
  })

  it('converts 12 szabo to mwei', async function () {
    assert.equal(
      await hre.run(
        { scope: 'util', task: 'unit' },
        {
          value: '12',
          from: 'szabo',
          to: 'mwei',
        },
      ),
      '12000000',
    )
  })
})
