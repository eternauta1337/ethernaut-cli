const assert = require('assert');
const { useEnvironment } = require('common/test-helpers');

describe('util', function () {
  useEnvironment('basic-project');

  it('has an "oz" scope', async function () {
    assert.notEqual(this.hre.scopes['oz'], undefined);
  });
});
