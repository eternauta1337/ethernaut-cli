const spinner = require('common/src/spinner');
const warnWithPrompt = require('../internal/warn-prompt');
const getBalance = require('../internal/get-balance');

module.exports = async function conenctSigner(noConfirm) {
  spinner.progress('Connecting signer', 'interact');

  const signer = (await hre.ethers.getSigners())[0];
  const balance = await getBalance(signer.address);

  spinner.success(
    `Connected signer ${signer.address} (${balance} ETH)`,
    'interact'
  );

  if (balance <= 0 && !noConfirm) {
    await warnWithPrompt(
      'WARNING! Signer balance is 0. You may not be able to send transactions.'
    );
  }

  return signer;
};
