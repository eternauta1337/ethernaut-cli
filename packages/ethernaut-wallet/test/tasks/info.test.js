const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('../../src/internal/storage')

describe('info', function () {
  const terminal = new Terminal()

  const demoSig = {
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    pk: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  }

  describe('when querying info about a signer', function () {
    before('add test signers', async function () {
      const signers = storage.readSigners()
      if (!('test__3' in signers)) signers.test__3 = demoSig
      storage.storeSigners(signers)
    })

    after('remove test signers', async function () {
      const signers = storage.readSigners()
      if ('test__3' in signers) delete signers.test__3
      storage.storeSigners(signers)
    })

    describe('when specifying an alias', function () {
      let balance

      before('query', async function () {
        await terminal.run('npx nyc hardhat wallet info test__3')
      })

      before('get balance', async function () {
        balance = await hre.ethers.provider.getBalance(demoSig.address)
        balance = hre.ethers.formatEther(balance)
      })

      it('shows the expected results', async function () {
        terminal.has('Alias: test__3')
        terminal.has(`Address: ${demoSig.address}`)
        terminal.has(`Balance: ${balance}`)
      })
    })
  })
})
