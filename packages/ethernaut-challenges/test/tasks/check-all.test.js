const assert = require('assert')
const { findLineWith } = require('common/src/strings')
const { extractAddress } = require('common/src/address')
const helper = require('../../src/internal/helper')
const deploy = require('../helpers/deploy')

describe('check-all', function () {
  let output

  before('deploy game', async function () {
    await deploy(hre)
  })

  describe('before completing any level', function () {
    before('run check-all', async function () {
      output = await hre.run({ scope: 'challenges', task: 'check-all' })
    })

    it('shows that level 1 is incomplete', async function () {
      assert.equal(findLineWith('Level 1:', output), 'false')
    })

    it('shows that level 2 is incomplete', async function () {
      assert.equal(findLineWith('Level 2:', output), 'false')
    })

    it('shows that level 3 is incomplete', async function () {
      assert.equal(findLineWith('Level 3:', output), 'false')
    })

    describe('when completing level 1', function () {
      let instanceAddress

      before('get instance', async function () {
        output = await hre.run(
          { scope: 'challenges', task: 'instance' },
          { level: '1' },
        )
        instanceAddress = extractAddress(output)
      })

      before('complete instance', async function () {
        const abi = helper.getAbi('Instance')
        const contract = await hre.ethers.getContractAt(abi, instanceAddress)
        const tx = await contract.authenticate('ethernaut0')
        await tx.wait()
      })

      before('submit instance', async function () {
        output = await hre.run(
          { scope: 'challenges', task: 'submit' },
          { address: instanceAddress },
        )
      })

      before('run check-all', async function () {
        output = await hre.run({ scope: 'challenges', task: 'check-all' })
      })

      it('shows that level 1 is complete', async function () {
        assert.equal(findLineWith('Level 1:', output), 'true')
      })

      it('shows that level 2 is incomplete', async function () {
        assert.equal(findLineWith('Level 2:', output), 'false')
      })

      it('shows that level 3 is incomplete', async function () {
        assert.equal(findLineWith('Level 3:', output), 'false')
      })
    })
  })
})
