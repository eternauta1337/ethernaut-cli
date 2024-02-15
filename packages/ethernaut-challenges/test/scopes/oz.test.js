const assert = require('assert');
const { useEnvironment } = require('common/test-helpers');

describe('util', function () {
  const hre = useEnvironment('basic-project');

  it('has an "oz" scope', async function () {
    assert.notEqual(hre().scopes['oz'], undefined);
  });
});
