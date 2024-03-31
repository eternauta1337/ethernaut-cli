const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-wallet/src/internal/storage')

describe('remove', function () {
  const terminal = new Terminal()

  before('add test signers', async function () {
    const signers = storage.readSigners()
    if (!('test__3' in signers)) signers.test__3 = { pk: '0x123' }
    if (!('test__4' in signers)) signers.test__4 = { pk: '0x123' }
    storage.storeSigners(signers)
  })

  after('remove test signers', async function () {
    const signers = storage.readSigners()
    if ('test__3' in signers) delete signers.test__3
    if ('test__4' in signers) delete signers.test__4
    storage.storeSigners(signers)
  })

  before('run remove', async function () {
    await terminal.run('npx nyc hardhat wallet remove test__3')
  })

  it('removes the signer', async function () {
    const signers = storage.readSigners()
    assert.equal(signers.test__3, undefined)
  })
})
