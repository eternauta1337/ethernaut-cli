const assert = require('assert');
const { useEnvironment, collectOutput } = require('common/test-helpers');

describe('unit', function () {
  const hre = useEnvironment('basic-project');
  const output = collectOutput();

  it('converts 1 ether to wei', async function () {
    await hre().run(
      { scope: 'util', task: 'unit' },
      {
        value: '1',
        from: 'ether',
        to: 'wei',
      }
    );
    assert.equal(output(), '1000000000000000000');
  });

  it('converts 1 wei to ether', async function () {
    await hre().run(
      { scope: 'util', task: 'unit' },
      {
        value: '1',
        from: 'wei',
        to: 'ether',
      }
    );
    assert.equal(output(), '0.000000000000000001');
  });

  it('converts 12 szabo to mwei', async function () {
    await hre().run(
      { scope: 'util', task: 'unit' },
      {
        value: '12',
        from: 'szabo',
        to: 'mwei',
      }
    );
    assert.equal(output(), '12000000');
  });
});
