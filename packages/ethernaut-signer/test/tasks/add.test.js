const assert = require('assert')
const { Terminal } = require('common/src/terminal')
const storage = require('ethernaut-signer/src/internal/storage')

describe('add', function () {
  const terminal = new Terminal()

  const removeTestSigners = function () {
    const signers = storage.readSigners()
    if ('test__1' in signers) delete signers.test__1
    storage.storeSigners(signers)
  }

  before('remove test networks', removeTestSigners)
  after('remove test networks', removeTestSigners)

  describe('when all params are specified', function () {
    before('run add', async function () {
      await terminal.run('npx hardhat sig add test__1 --pk 0x123')
    })

    it('adds the signer', async function () {
      const signers = storage.readSigners()
      assert.deepEqual(signers.test__1, { pk: '0x123' })
    })
  })
})
