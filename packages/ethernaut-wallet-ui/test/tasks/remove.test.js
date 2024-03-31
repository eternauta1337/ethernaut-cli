const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-wallet/src/internal/storage')

describe('remove ui', function () {
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

  describe('when alias is missing', function () {
    before('run remove', async function () {
      await terminal.run('npx hardhat wallet remove', 2000)
    })

    it('suggests wallets', async function () {
      terminal.has('Select a wallet')
      terminal.has('test__4')
    })

    describe('when a signer is chosen', function () {
      before('select', async function () {
        await terminal.input('4\r')
      })

      it('removes the signer', async function () {
        const signers = storage.readSigners()
        assert.equal(signers.test__4, undefined)
      })
    })
  })
})
