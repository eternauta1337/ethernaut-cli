const assert = require('assert')
const helper = require('../../src/internal/helper')
const { findLineWith } = require('common/src/strings')
const hre = require('hardhat')

describe('info', function () {
  let deploymentInfo

  before('load deployment info', async function () {
    deploymentInfo = helper.getDeploymentInfo('local')
  })

  describe('when info is called on level 1', function () {
    let levelInfo

    before('run info 1', async function () {
      levelInfo = await hre.run({ scope: 'oz', task: 'info' }, { level: '1' })
    })

    it('shows level name', async function () {
      assert.equal(findLineWith('Level name:', levelInfo), 'Hello Ethernaut')
    })

    it('shows contract name', async function () {
      assert.equal(findLineWith('Contract name:', levelInfo), 'Instance.sol')
    })

    it('shows abi path', async function () {
      assert.equal(
        findLineWith('ABI path:', levelInfo),
        '~/ethernaut-cli/packages/ethernaut-challenges/test/fixture-projects/basic-project/artifacts/interact/abis/Instance.json',
      )
    })

    it('shows address', async function () {
      assert.equal(findLineWith('Address:', levelInfo), deploymentInfo['1'])
    })

    it('shows description', async function () {
      assert.equal(findLineWith('#### 1.', levelInfo), 'Set up MetaMask')
      assert.equal(
        findLineWith('#### 9.', levelInfo),
        'Interact with the contract to complete the level',
      )
    })

    it('doesnt show source', async function () {
      assert.ok(!levelInfo.includes('pragma solidity'))
    })
  })

  describe('when info is called on level 2', function () {
    let levelInfo

    before('run info 2', async function () {
      levelInfo = await hre.run({ scope: 'oz', task: 'info' }, { level: '2' })
    })

    it('shows level name', async function () {
      assert.equal(findLineWith('Level name:', levelInfo), 'Fallback')
    })

    it('shows contract name', async function () {
      assert.equal(findLineWith('Contract name:', levelInfo), 'Fallback.sol')
    })

    it('shows abi path', async function () {
      assert.equal(
        findLineWith('ABI path:', levelInfo),
        '~/ethernaut-cli/packages/ethernaut-challenges/test/fixture-projects/basic-project/artifacts/interact/abis/Fallback.json',
      )
    })

    it('shows address', async function () {
      assert.equal(findLineWith('Address:', levelInfo), deploymentInfo['2'])
    })

    it('shows description', async function () {
      assert.equal(
        findLineWith('1)', levelInfo),
        'you claim ownership of the contract',
      )
    })

    it('shows source', async function () {
      assert.ok(levelInfo.includes('pragma solidity'))
    })
  })
})
