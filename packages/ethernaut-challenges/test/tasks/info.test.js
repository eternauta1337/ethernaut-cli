const assert = require('assert');
const helper = require('../../src/internal/helper');
const {
  useEnvironment,
  collectOutput,
  extractLine,
} = require('common/test-helpers');

describe('info', function () {
  let deploymentInfo;

  const hre = useEnvironment('basic-project');
  const output = collectOutput();

  before('load deployment info', async function () {
    deploymentInfo = helper.getDeploymentInfo();
  });

  describe('when info is called on level 1', function () {
    let levelInfo;

    before('run info 1', async function () {
      await hre().run({ scope: 'oz', task: 'info' }, { level: '1' });
      levelInfo = output();
    });

    it('shows level name', async function () {
      assert.equal(extractLine(levelInfo, 'Level name:'), 'Hello Ethernaut');
    });

    it('shows contract name', async function () {
      assert.equal(extractLine(levelInfo, 'Contract name:'), 'Instance.sol');
    });

    it('shows abi path', async function () {
      assert.ok(
        extractLine(levelInfo, 'ABI path:').includes(
          'basic-project/artifacts/interact/abis/Instance.json'
        )
      );
    });

    // TODO: Source
    // TODO: Description
  });
});
