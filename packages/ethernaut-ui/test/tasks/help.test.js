const assert = require('assert');
const { Terminal } = require('common/terminal');

describe('help', function () {
  const terminal = new Terminal();

  describe('when entering the cli with no arguments', function () {
    before('run hardhat', async function () {
      await terminal.run('npx hardhat', 1000);
    });

    it('displays the main prompt', async function () {
      assert.ok(terminal.output.includes('Pick a task or scope'));
    });

    it('displays the util scope', async function () {
      assert.ok(terminal.output.includes('[util]'));
    });
  });
});
