const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('list', function () {
  const terminal = new Terminal()

  before('add some signers', async function () {
    const signers = storage.readSigners()
    if (!('test__3' in signers)) signers.test__3 = { address: 'poop1' }
    if (!('test__4' in signers)) signers.test__4 = { address: 'poop2' }
    storage.storeSigners(signers)
  })

  after('remove signers', async function () {
    const signers = storage.readSigners()
    if ('test__3' in signers) delete signers.test__3
    if ('test__4' in signers) delete signers.test__4
    storage.storeSigners(signers)
  })

  describe('when calling list', function () {
    before('call', async function () {
      await terminal.run('npx hardhat wallet list')
    })

    it('prints the signers', async function () {
      terminal.has('- test__3 (poop1)')
      terminal.has('- test__4 (poop2)')
    })
  })
})
