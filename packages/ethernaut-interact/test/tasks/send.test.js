const assert = require('assert');
const getBalance = require('../../src/internal/get-balance');
const { Terminal, keys } = require('common/terminal');

describe('send', function () {
  const terminal = new Terminal();

  describe('when sending ETH between EOAs', function () {
    let output;
    let signer1, signer2;
    let balance1, balance2;

    before('get signers and balances', async function () {
      const signers = await hre.ethers.getSigners();
      signer1 = signers[0];
      signer2 = signers[1];
      balance1 = await getBalance(signer1.address);
      balance2 = await getBalance(signer2.address);
      console.log('balance1', balance1);
      console.log('balance2', balance2);
    });

    describe('when signer 1 sends ETH to signer 2', function () {
      before('run send', async function () {
        // output = await hre.run(
        //   { scope: 'interact', task: 'send' },
        //   { address: signer2.address, value: '1', noConfirm: true }
        // );
        await terminal.run(
          `npx hardhat interact send --address ${signer2.address} --value 1 --no-confirm`,
          1000
        );
      });

      it('sent the ETH', async function () {
        const newBalance1 = await getBalance(signer1.address);
        const newBalance2 = await getBalance(signer2.address);
        console.log('balance1', newBalance1);
        console.log('balance2', newBalance2);
        assert.equal(newBalance1, balance1 - 1, 'balance1');
        assert.equal(newBalance2, balance2 + 1, 'balance2');
      });

      it.skip('printed a tx summary', async function () {});
      it.skip('prompted for confirmation', async function () {});
      it.skip('shows tx results', async function () {});
      it.skip('shows shows final sender balance', async function () {});
    });
  });
});
