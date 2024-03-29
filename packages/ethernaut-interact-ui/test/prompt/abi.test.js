const { Terminal, keys } = require('ethernaut-common/src/test/terminal')

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
          'npx hardhat interact contract --address 0xdAC17F958D2ee523a2206206994597C13D831ec7 --network mainnet',
          4000,
        )
      })

      it('provides the option to fetch abi from etherscan', async function () {
        terminal.has('Fetch from Etherscan')
      })

      describe('when etherscan is selected', function () {
        before('nav', async function () {
          await terminal.input(keys.DOWN)
          await terminal.input(keys.DOWN)
          await terminal.input(keys.DOWN)
          await terminal.input(keys.ENTER, 2000)
        })

        it('finds the TetherToken ABI', async function () {
          terminal.has('Abi fetched from Etherscan TetherToken')
        })

        it('displays the fns', async function () {
          terminal.has('name()')
          terminal.has('decimals()')
        })
      })
    })
  })

  describe('when browsing known ABIs', function () {
    before('call', async function () {
      await terminal.run('npx hardhat interact contract', 2000)
    })

    before('nav', async function () {
      await terminal.input(keys.DOWN)
      await terminal.input(keys.DOWN)
      await terminal.input(keys.ENTER)
    })

    it('shows known ABIs', async function () {
      terminal.has('CoinFlip')
      terminal.has('DelegateERC20')
    })
  })

  describe('when browsing the fs', function () {
    before('call', async function () {
      await terminal.run('npx hardhat interact contract', 2000)
    })

    before('nav', async function () {
      await terminal.input(keys.DOWN)
      await terminal.input(keys.ENTER)
    })

    it('shows back nav', async function () {
      terminal.has('..')
    })

    it('shows home dir abbreviation', async function () {
      terminal.has('~')
    })
  })
})
