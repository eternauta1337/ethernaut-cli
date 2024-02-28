const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')
const { getWallet } = require('../../src/internal/signers')

describe('info', function () {
  const terminal = new Terminal()

  const demoSig = {
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    pk: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  }

  describe('when queryig info about a signer', function () {
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

    describe('when signing a message', function () {
      before('sign', async function () {
        await terminal.run('npx hardhat sig sign "hello"')
      })

      it('prints the expected signature', async function () {
        terminal.has('Result')

        const wallet = getWallet(demoSig.pk)
        const sig = wallet.signMessageSync('hello')
        terminal.has(sig.slice(0, 15))
      })
    })
  })
})
