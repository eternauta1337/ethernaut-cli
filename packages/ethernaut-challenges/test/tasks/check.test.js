const assert = require('assert')
const { extractAddress } = require('ethernaut-common/src/address')
const helper = require('../../src/internal/helper')
const deploy = require('../helpers/deploy')

describe('check', function () {
  before('deploy game', async function () {
    await deploy(hre)
  })

  describe('when an instance of level 1 is required', function () {
    let instanceAddress

    before('run instance 1', async function () {
      const output = await hre.run(
        { scope: 'challenges', task: 'instance' },
        { level: 1 },
      )
      instanceAddress = extractAddress(output)
    })

    describe('before the instance is modified', function () {
      it('shows that the level hasnt been completed', async function () {
        assert.equal(
          await hre.run({ scope: 'challenges', task: 'check' }, { level: 1 }),
          'Level not completed',
        )
      })

      describe('when the instance is modified but not submitted yet', function () {
        before('modify the instance', async function () {
          const abi = helper.getAbi('Instance')
          const contract = await hre.ethers.getContractAt(abi, instanceAddress)
          const tx = await contract.authenticate('ethernaut0')
          await tx.wait()
        })

        it('still shows that the level hasnt been completed', async function () {
          assert.equal(
            await hre.run({ scope: 'challenges', task: 'check' }, { level: 1 }),
            'Level not completed',
          )
        })

        describe('when the instance is submitted', function () {
          before('submit instance', async function () {
            await hre.run(
              { scope: 'challenges', task: 'submit' },
              { address: instanceAddress },
            )
          })

          it('shows that the level has been completed', async function () {
            assert.equal(
              await hre.run(
                { scope: 'challenges', task: 'check' },
                { level: 1 },
              ),
              'Level completed',
            )
          })
        })
      })
    })
  })
})
