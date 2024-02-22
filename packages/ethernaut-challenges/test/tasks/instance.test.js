const assert = require('assert');
const { containsAddress, extractAddress } = require('common/address');
const helper = require('../../src/internal/helper');
const deploy = require('../helpers/deploy');

describe('instance', function () {
  let deploymentInfo;

  before('deploy game', async function () {
    await deploy(hre);
  });

  before('get gamedata', async function () {
    deploymentInfo = helper.getDeploymentInfo('local');
  });

  describe('when instance is called for level 1', function () {
    let output;

    before('run instance 1', async function () {
      output = await hre.run({ scope: 'oz', task: 'instance' }, { level: '1' });
    });

    it('reports creation', async function () {
      assert.ok(output.includes('Instance created'));
    });

    it('produces an address', async function () {
      assert.ok(containsAddress(output));
    });

    describe('when interacting with the contract', function () {
      let contract;

      before('instantiate contract', async function () {
        const address = extractAddress(output);
        const abi = helper.getAbi('Instance');
        contract = await hre.ethers.getContractAt(abi, address);
      });

      it('has an info42 view fn', async function () {
        assert.equal(
          await contract.info42(),
          'theMethodName is the name of the next method.'
        );
      });

      it('has a password view fn', async function () {
        assert.equal(await contract.password(), 'ethernaut0');
      });
    });
  });

  describe('when instance is called for level 2', function () {
    let output;

    before('run instance 2', async function () {
      output = await hre.run({ scope: 'oz', task: 'instance' }, { level: '2' });
    });

    it('reports creation', async function () {
      assert.ok(output.includes('Instance created'));
    });

    it('produces an address', async function () {
      assert.ok(containsAddress(output));
    });

    describe('when interacting with the contract', function () {
      let contract;
      let levelAddress;

      before('instantiate contract', async function () {
        const address = extractAddress(output);
        const abi = helper.getAbi('Fallback');
        contract = await hre.ethers.getContractAt(abi, address);
      });

      before('identify level address', async function () {
        levelAddress = deploymentInfo[1];
      });

      it('has an owner', async function () {
        assert.equal(await contract.owner(), levelAddress);
      });

      it('reports the correct contribution for the owner', async function () {
        assert.equal(
          await contract.contributions(levelAddress),
          hre.ethers.parseEther('1000')
        );
      });
    });
  });
});
