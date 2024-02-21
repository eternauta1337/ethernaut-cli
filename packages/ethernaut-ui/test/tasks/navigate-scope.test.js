const assert = require('assert');
const { Terminal, keys } = require('common/terminal');

describe('navigate scope', function () {
  const terminal = new Terminal();

  describe('when entering navigation at a particular scope', function () {
    before('run navigate util', async function () {
      await terminal.run('npx hardhat navigate util', 1000);
    });

    it('displays the main prompt', async function () {
      assert.ok(terminal.output.includes('Pick a task or scope'));
    });

    it('doesnt display any scopes', async function () {
      assert.ok(!terminal.output.includes('['));
    });

    it('shows utils', async function () {
      assert.ok(terminal.output.includes('to-bytes'));
      assert.ok(terminal.output.includes('to-string'));
      assert.ok(terminal.output.includes('unit'));
    });

    it('shows the up nav', async function () {
      assert.ok(terminal.output.includes('up'));
    });

    describe('when navigating up', function () {
      before('navigate', async function () {
        await terminal.input(keys.ENTER, 100);
      });

      it('does not show utils', async function () {
        assert.ok(!terminal.output.includes('to-bytes'));
        assert.ok(!terminal.output.includes('to-string'));
        assert.ok(!terminal.output.includes('unit'));
      });

      it('shows the util scope', async function () {
        assert.ok(terminal.output.includes('[util]'));
      });
    });
  });
});
