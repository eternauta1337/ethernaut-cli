const { Terminal, keys } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-interact/src/internal/storage')
const assert = require('assert')
const path = require('path')
const suggestAbi = require('../../src/suggest/abi')
const { getChainId } = require('ethernaut-common/src/util/network')

describe('contract ui', function () {
  const terminal = new Terminal()

  describe('params prompt', function () {
    const terminal = new Terminal()

    describe('when transferring a token', function () {
      const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      before('interact', async function () {
        const abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')
        await terminal.run(
          `hardhat interact contract --abi ${abi} --address ${addr} --fn transfer`,
          4000,
        )
      })

      it('queries _to', async function () {
        terminal.has('Enter _to (address)')
      })

      describe('when _to is entered', function () {
        before('enter', async function () {
          await terminal.input(`${addr}\n`, 200)
        })

        it('queries value', async function () {
          terminal.has('Enter _value (uint256)')
        })
      })
    })
  })

  describe('fn prompt', function () {
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

  describe('abi suggest', function () {
    let result
    const params = { hre }

    describe('when an abi is given', function () {
      describe('when a complete abi path is given', function () {
        before('provide partial abi', async function () {
          params.abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')
        })

        describe('suggestAbi', function () {
          before('suggest', async function () {
            result = await suggestAbi(params)
          })

          it('returns the same abi path', async function () {
            assert.equal(
              result,
              path.resolve(storage.getAbisFilePath(), 'erc20.json'),
            )
          })
        })
      })

      describe('when a partial abi path is given', function () {
        before('provide partial abi', async function () {
          params.abi = 'erc20'
        })

        describe('suggestAbi', function () {
          before('suggest', async function () {
            result = await suggestAbi(params)
          })

          it('returns the full abi path', async function () {
            assert.equal(
              result,
              path.resolve(storage.getAbisFilePath(), 'erc20.json'),
            )
          })
        })
      })
    })

    describe('when an abi is not given', function () {
      before('no abi', async function () {
        params.abi = undefined
      })

      describe('when an address is given in the local network', function () {
        before('provide address', async function () {
          params.address = '0x123'
        })

        describe('when an entry exists in the local network for this abi', function () {
          let chainId
          let expectedAbi = 'SOME-ABI.json'

          before('get chain id', async function () {
            chainId = await getChainId(hre)
          })

          before('insert entry', async function () {
            const addresses = storage.readAddresses()
            if (!addresses[chainId]) addresses[chainId] = {}
            addresses[chainId][params.address] = expectedAbi
            storage.storeAddresses(addresses)
          })

          after('clean up entry', async function () {
            const addresses = storage.readAddresses()
            delete addresses[chainId][params.address]
            storage.storeAddresses(addresses)
          })

          describe('suggestAbi', function () {
            before('suggest', async function () {
              result = await suggestAbi(params)
            })

            it('returns the expected abi', async function () {
              assert.equal(result, expectedAbi)
            })
          })
        })
      })
    })
  })

  describe('abi prompt', function () {
    const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

    describe('when an address is not provided', function () {
      before('call', async function () {
        await terminal.run('hardhat interact contract', 2000)
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

    describe('when an address is provided', function () {
      before('call', async function () {
        await terminal.run(
          `hardhat interact contract --address ${addr} --network mainnet`,
          4000,
        )
      })

      it('provides the option to fetch abi from etherscan', async function () {
        terminal.has('Fetch from Etherscan')
      })
    })

    describe('when fetching an ABI from etherscan', function () {
      describe('for a verified contract', function () {
        before('call', async function () {
          await terminal.run(
            `hardhat interact contract --address ${addr} --network mainnet`,
            4000,
          )
        })

        describe('when etherscan is selected', function () {
          before('nav', async function () {
            await terminal.input(keys.DOWN)
            await terminal.input(keys.DOWN)
            await terminal.input(keys.DOWN)
            await terminal.input(keys.ENTER, 6000)
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

      describe('for an EOA', function () {
        before('call', async function () {
          await terminal.run(
            'hardhat interact contract --address 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --network mainnet',
            4000,
          )
        })

        describe('when etherscan is selected', function () {
          before('nav', async function () {
            await terminal.input(keys.DOWN)
            await terminal.input(keys.DOWN)
            await terminal.input(keys.DOWN)
            await terminal.input(keys.ENTER, 6000)
          })

          it('shows that the source code is not verified', async function () {
            terminal.has('Contract source code not verified')
          })
        })
      })
    })

    describe('when browsing known ABIs', function () {
      before('call', async function () {
        await terminal.run('hardhat interact contract', 2000)
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
            const abi = path.resolve(
              storage.getAbisFilePath(),
              'TetherToken.json',
            )
            const address = storage.findAddressWithAbi(abi, '1')
            assert.equal(address.toLowerCase(), addr.toLowerCase())
          })
        })
      })
    })

    describe('when browsing the file system', function () {
      before('call', async function () {
        await terminal.run('hardhat interact contract', 2000)
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
})
