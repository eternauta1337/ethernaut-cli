const assert = require('assert');
const { useEnvironment } = require('common/test-helpers');

describe('util', function () {
  const hre = useEnvironment('basic-project');

  it('has a "util" scope', async function () {
    assert.notEqual(hre().scopes['util'], undefined);
  });
});
