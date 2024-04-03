const { Terminal } = require('ethernaut-common/src/test/terminal')
const storage = require('ethernaut-interact/src/internal/storage')
const path = require('path')

describe('token ui', function () {
  describe('address suggestion', function () {
    const terminal = new Terminal()

    describe('when an entry exists in this network for this abi', function () {
      let expectedAddress = '0xdeadbeef'
      const networkName = 'local'

      before('insert entry', async function () {
        const abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')
        const addresses = storage.readAddresses()
        if (!addresses[networkName]) addresses[networkName] = {}
        addresses[networkName][expectedAddress] = abi
        storage.storeAddresses(addresses)
      })

      after('clean up entry', async function () {
        const addresses = storage.readAddresses()
        delete addresses[networkName][expectedAddress]
        storage.storeAddresses(addresses)
      })

      describe('when interacting without specifying an address', function () {
        before('call', async function () {
          await terminal.run('hardhat interact token', 2000)
        })

        it('suggests address', async function () {
          terminal.has('Enter address')
          terminal.has(expectedAddress)
        })
      })
    })
  })

  describe('fnERC20 prompt', function () {
    const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

    const terminal = new Terminal()

    describe('when an abi is provided', function () {
      before('call', async function () {
        await terminal.run(`hardhat interact token ${addr}`, 2000)
      })

      it('presents functions', async function () {
        terminal.has('transfer')
        terminal.has('transferFrom')
      })
    })
  })

  describe('params ERC20 prompt', function () {
    const terminal = new Terminal()

    describe('when transferring a token', function () {
      const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      before('interact', async function () {
        await terminal.run(`hardhat interact token ${addr} --fn transfer`, 4000)
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
})
