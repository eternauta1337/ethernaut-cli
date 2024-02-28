const { Terminal } = require('common/src/terminal')
const storage = require('../../src/internal/storage')

describe('active', function () {
  let activeSigner
  const terminal = new Terminal()

  before('get the active signer', async function () {
    activeSigner = storage.readSigners().activeSigner
  })

  describe('when calling active task', function () {
    before('call task', async function () {
      await terminal.run('npx hardhat sig active')
    })

    it('prints the active signer', async function () {
      terminal.has(`The active signer is "${activeSigner}"`)
    })
  })
})
