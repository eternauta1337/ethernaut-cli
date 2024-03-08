const assert = require('assert')
const { extractAddress } = require('ethernaut-common/src/address')
const helper = require('../../src/internal/helper')
const deploy = require('../helpers/deploy')

describe('submit', function () {
  before('deploy game', async function () {
    await deploy(hre)
  })

  describe('when an instance of level 1 is required', function () {
    let instanceAddress
    before('run instance 1', async function () {
      const output = await hre.run(
        { scope: 'challenges', task: 'instance' },
        { level: '1' },
      )
      instanceAddress = extractAddress(output)
    })

    describe('when submitting the instance', function () {
      describe('before the instance is modified', function () {
        let output

        before('submit instance', async function () {
          output = await hre.run(
            { scope: 'challenges', task: 'submit' },
            { address: instanceAddress },
          )
        })

        it('fails', async function () {
          assert.equal(
            output,
            'Level not completed: No events emitted upon submission',
          )
        })
      })

      describe('after the instance is modified', function () {
        let output
        let levelAddress

        before('modify the instance', async function () {
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

        before('get level address', async function () {
          const deploymentInfo = helper.getDeploymentInfo('local')
          levelAddress = deploymentInfo['0']
        })

        it('succeeds', async function () {
          assert.equal(
            output,
            `Level completed ${levelAddress} with instance ${instanceAddress}`,
          )
        })
      })
    })
  })
})
