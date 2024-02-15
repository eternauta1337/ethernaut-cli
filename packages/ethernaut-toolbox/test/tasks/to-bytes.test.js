const assert = require('assert');
const { useEnvironment, collectOutput } = require('common/test-helpers');

describe('to-bytes', function () {
  const hre = useEnvironment('basic-project');
  const output = collectOutput();

  it('converts "hello" to bytes', async function () {
    await hre().run({ scope: 'util', task: 'to-bytes' }, { value: 'hello' });
    assert.equal(
      output(),
      '0x68656c6c6f000000000000000000000000000000000000000000000000000000'
    );
  });

  it('converts "42" to bytes', async function () {
    await hre().run({ scope: 'util', task: 'to-bytes' }, { value: '42' });
    assert.equal(
      output(),
      '0x3432000000000000000000000000000000000000000000000000000000000000'
    );
  });

  it('converts "" to bytes', async function () {
    await hre().run({ scope: 'util', task: 'to-bytes' }, { value: '' });
    assert.equal(
      output(),
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
});
