const { Terminal, keys } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-interact/src/internal/storage')
const assert = require('assert')
const path = require('path')

describe('abi prompt', function () {
  const terminal = new Terminal()
  const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

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
          `npx hardhat interact contract --address ${addr} --network mainnet`,
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
          await terminal.input(keys.ENTER, 4000)
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

    describe('when erc20 is entered', function () {
      before('enter', async function () {
        await terminal.input('erc20', 500)
        await terminal.input(keys.DOWN)
        await terminal.input(keys.ENTER)
      })

      it('queries address', async function () {
        terminal.has('Enter address')
      })

      describe('when an address is provided', function () {
        before('provide address', async function () {
          await terminal.input(`${addr}\r`, 500)
        })

        it('displays functions', async function () {
          terminal.has('name()')
        })

        it('remembers the address and abi for mainnet', async function () {
          const abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')
          const address = storage.findAddressWithAbi(abi, '1')
          assert.equal(address, addr)
        })
      })
    })
  })

  describe('when browsing the fs', function () {
    before('call', async function () {
      await terminal.run('npx hardhat interact contract', 2000)
    })

    before('nav', async function () {
      await terminal.input(keys.DOWN)
      await terminal.input(keys.ENTER, 500)
    })

    it('shows query', async function () {
      terminal.has('Select a file or directory')
    })

    it('shows back nav', async function () {
      terminal.has('..')
    })

    it('shows home dir abbreviation', async function () {
      terminal.has('~')
    })
  })
})
