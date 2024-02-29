const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('current', function () {
  let activeSigner
  const terminal = new Terminal()

  const demoSig = {
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    pk: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  }

  before('add test signers', async function () {
    const signers = storage.readSigners()
    if (!('test__3' in signers)) signers.test__3 = demoSig
    signers.activeSigner = 'test__3'
    storage.storeSigners(signers)
  })

  after('remove test signers', async function () {
    const signers = storage.readSigners()
    if ('test__3' in signers) delete signers.test__3
    storage.storeSigners(signers)
  })

  before('get the active signer', async function () {
    activeSigner = storage.readSigners().activeSigner
  })

  describe('when calling the task', function () {
    before('call task', async function () {
      await terminal.run('npx hardhat wallet current ')
    })

    it('prints the active signer', async function () {
      terminal.has(`The current wallet is "${activeSigner}"`)
    })
  })
})
