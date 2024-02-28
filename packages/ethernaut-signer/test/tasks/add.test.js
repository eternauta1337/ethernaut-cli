const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-signer/src/internal/storage')

describe('add', function () {
  const terminal = new Terminal()

  const demoSig = {
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    pk: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  }

  const removeTestSigners = function () {
    const signers = storage.readSigners()
    if ('test__1' in signers) delete signers.test__1
    storage.storeSigners(signers)
  }

  before('remove test signers', removeTestSigners)
  after('remove test signers', removeTestSigners)

  describe('when all params are specified', function () {
    before('run add', async function () {
      await terminal.run(`npx hardhat sig add test__1 --pk ${demoSig.pk}`)
    })

    it('adds the signer', async function () {
      const signers = storage.readSigners()
      assert.deepEqual(
        signers.test__1,
        { address: demoSig.address, pk: demoSig.pk },
        terminal.output,
      )
    })
  })
})
