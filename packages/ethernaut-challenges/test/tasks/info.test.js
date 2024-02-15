const assert = require('assert');
const helper = require('../../src/internal/helper');
const { findLineWith } = require('common/strings');

describe('info', function () {
  let deploymentInfo;

  before('load deployment info', async function () {
    deploymentInfo = helper.getDeploymentInfo();
  });

  describe('when info is called on level 1', function () {
    let levelInfo;

    before('run info 1', async function () {
      levelInfo = await hre.run({ scope: 'oz', task: 'info' }, { level: '1' });
    });

    it('shows level name', async function () {
      assert.equal(findLineWith('Level name:', levelInfo), 'Hello Ethernaut');
    });

    it('shows contract name', async function () {
      assert.equal(findLineWith('Contract name:', levelInfo), 'Instance.sol');
    });

    it('shows abi path', async function () {
      assert.equal(
        findLineWith('ABI path:', levelInfo),
        '~/ethernaut-cli/packages/ethernaut-challenges/test/fixture-projects/basic-project/artifacts/interact/abis/Instance.json'
      );
    });

    // TODO: Source
    // TODO: Description
  });
});
