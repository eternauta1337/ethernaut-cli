const assert = require('assert');
const {
  isAddress,
  containsAddress,
  extractAddress,
} = require('../src/address');

describe('address', function () {
  describe('isAddress', function () {
    it('returns true for valid address', function () {
      assert.ok(isAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
    });

    it('returns false for invalid addresses', async function () {
      assert.ok(!isAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb9226'));
      assert.ok(!isAddress('f39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
      assert.ok(!isAddress('poop'));
      assert.ok(
        !isAddress(
          '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
        )
      );
    });
  });

  describe('containsAddress', function () {
    it('returns true for text that contains an address', async function () {
      assert.ok(containsAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'));
      assert.ok(
        containsAddress(
          'There is an address in here 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
        )
      );
      assert.ok(
        containsAddress(
          `There\nis\nan\naddress\nin\nhere\n0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
        )
      );
    });

    it('returns false for text that doesnt contain an address', async function () {
      assert.ok(!containsAddress('poop'));
      assert.ok(
        !containsAddress(
          'There is an address in here  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb9226'
        )
      );
      assert.ok(
        !containsAddress(
          'This is not an address, it is a private key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
        )
      );
    });
  });

  describe('extractAddress', function () {
    it('can extract an address from some text', async function () {
      const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
      assert.equal(
        extractAddress(`There is an\naddress in here ${address}`),
        address
      );
    });

    it('returns null when there is no address', async function () {
      assert.equal(
        extractAddress('There is an address... op! nevermind xP'),
        null
      );
    });
  });
});
