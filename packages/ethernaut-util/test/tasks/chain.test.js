const assert = require('assert')

describe('chain', function () {
  it('Finds mainnet from chain id', async function () {
    assert.equal(
      await hre.run({ scope: 'util', task: 'chain' }, { filter: '1' }),
      'Ethereum Mainnet',
    )
  })

  it('Lists Optimism from OP', async function () {
    const out = await hre.run(
      { scope: 'util', task: 'chain' },
      { filter: 'OP' },
    )
    assert.ok(out.includes('OP Mainnet'), out)
  })
})
