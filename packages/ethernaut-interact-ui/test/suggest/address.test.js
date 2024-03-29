const assert = require('assert')
const suggestAddress = require('../../src/suggest/address')
const { getNetworkName } = require('ethernaut-common/src/util/network')
const storage = require('ethernaut-interact/src/internal/storage')

describe('suggest address', function () {
  let result
  const params = { hre }

  describe('when an address is given', function () {
    before('provide address', async function () {
      params.address = '0x123'
    })

    describe('suggestAddress', function () {
      before('suggest', async function () {
        result = await suggestAddress(params)
      })

      it('returns the address', async function () {
        assert.equal(result, params.address)
      })
    })
  })

  describe('when an address is not given', function () {
    before('no address', async function () {
      params.address = undefined
    })

    describe('when no abi is given', function () {
      describe('suggestAddress', function () {
        before('suggest', async function () {
          result = await suggestAddress(params)
        })

        it('returns undefined', async function () {
          assert.equal(result, undefined)
        })
      })
    })

    describe('when an abi is given', function () {
      before('provide abi', async function () {
        params.abi = 'some/abi'
      })

      describe('in the local network', function () {
        let networkName

        before('get network', async function () {
          networkName = await getNetworkName(hre)
        })

        it('confirms it is in the local network', async function () {
          assert.equal(networkName, 'local')
        })

        describe('when no entry exists for this abi', function () {
          describe('suggestAddress', function () {
            before('suggest', async function () {
              result = await suggestAddress(params)
            })

            it('returns undefined', async function () {
              assert.equal(result, undefined)
            })
          })
        })

        describe('when an entry exists in this network for this abi', function () {
          let expectedAddress = '0xdeadbeef'

          before('insert entry', async function () {
            const addresses = storage.readAddresses()
            addresses[networkName][expectedAddress] = params.abi
            storage.storeAddresses(addresses)
          })

          after('clean up entry', async function () {
            const addresses = storage.readAddresses()
            delete addresses[networkName][expectedAddress]
            storage.storeAddresses(addresses)
          })

          describe('suggestAddress', function () {
            before('suggest', async function () {
              result = await suggestAddress(params)
            })

            it('returns the expected address', async function () {
              assert.equal(result, expectedAddress)
            })
          })
        })
      })
    })
  })
})
