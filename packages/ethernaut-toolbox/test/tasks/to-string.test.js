const assert = require('assert');
const { useEnvironment, collectOutput } = require('common/test-helpers');

describe('to-string', function () {
  const hre = useEnvironment('basic-project');
  const output = collectOutput();

  it('converts "hello" from bytes', async function () {
    await hre().run(
      { scope: 'util', task: 'to-string' },
      {
        value:
          '0x68656c6c6f000000000000000000000000000000000000000000000000000000',
      }
    );
    assert.equal(output(), 'hello');
  });

  it('converts "42" from bytes', async function () {
    await hre().run(
      { scope: 'util', task: 'to-string' },
      {
        value:
          '0x3432000000000000000000000000000000000000000000000000000000000000',
      }
    );
    assert.equal(output(), '42');
  });

  it('converts "" from bytes', async function () {
    await hre().run(
      { scope: 'util', task: 'to-string' },
      {
        value:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      }
    );
    assert.equal(output(), '');
  });

  it('throws when an invalid bytes value is passed', async function () {
    await hre().run(
      { scope: 'util', task: 'to-string' },
      {
        value: 'abc',
      }
    );
    assert.ok(output().includes('invalid BytesLike value'));
  });
});
