const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-signer/src/internal/storage')

describe('set', function () {
  const terminal = new Terminal()

  const demoSig = {
    pk: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
    address: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
  }

  before('add test signers', async function () {
    const signers = storage.readSigners()
    if (!('test__3' in signers))
      signers.test__3 = {
        address: demoSig.address,
        pk: demoSig.pk,
      }
    storage.storeSigners(signers)
  })

  after('remove test signers', async function () {
    const signers = storage.readSigners()
    if ('test__3' in signers) delete signers.test__3
    storage.storeSigners(signers)
  })

  describe('when all params are specified', function () {
    before('run set', async function () {
      await terminal.run('npx hardhat sig set test__3')
    })

    it('stored the active signer', async function () {
      const signers = storage.readSigners()
      assert.equal(signers.activeSigner, 'test__3')
    })

    it('adds the signer', async function () {
      const signers = await hre.ethers.getSigners()
      const signer = signers[0]
      assert.equal(signer.address, demoSig.address)
    })
  })
})
