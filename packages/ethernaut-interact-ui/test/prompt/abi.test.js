const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('abi prompt', function () {
  const terminal = new Terminal()

  describe('when an address is not provided', function () {
    before('call', async function () {
      await terminal.run('npx hardhat interact contract', 2000)
    })

    it('queries for a strategy', async function () {
      terminal.has('How would you like to specify an ABI?')
    })

    it('provides the manual option', async function () {
      terminal.has('Enter path manually')
    })

    it('provides the browsing option', async function () {
      terminal.has('Browse file system')
    })

    it('provides the option to browse known abis', async function () {
      terminal.has('Browse known ABIs')
    })
  })

  describe('when in mainnet', function () {
    describe('when an address is provided', function () {
      before('call', async function () {
        await terminal.run(
          'npx hardhat interact contract --address 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 --network mainnet',
          2000,
        )
      })

      it('provides the option to fetch abi from etherscan', async function () {
        terminal.has('Fetch from Etherscan')
      })
    })
  })
})
