const path = require('path')
const storage = require('ethernaut-interact/src/internal/storage')
const { Terminal } = require('ethernaut-common/src/test/terminal')

describe.skip('fn prompt', function () {
  const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  const abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')

  const terminal = new Terminal()

  describe('when an abi is provided', function () {
    before('call', async function () {
      await terminal.run(
        `hardhat interact contract --address ${addr} --abi ${abi}`,
        2000,
      )
    })

    it('presents functions', async function () {
      terminal.has('transfer')
      terminal.has('transferFrom')
    })
  })
})
