const assert = require('assert')
const suggestAbi = require('../../src/suggest/abi')
const storage = require('ethernaut-interact/src/internal/storage')
const { getChainId } = require('ethernaut-common/src/util/network')
const path = require('path')

describe('suggest abi', function () {
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
