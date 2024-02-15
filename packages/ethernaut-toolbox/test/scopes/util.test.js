const assert = require('assert');
const { useEnvironment } = require('common/test-helpers');

describe('util', function () {
  useEnvironment('basic-project');

  it('has a "util" scope', async function () {
    assert.notEqual(this.hre.scopes['util'], undefined);
  });
});
