const cliSpinners = require('cli-spinners');

async function showSpinner() {
  const module = await import('ora');
  const ora = module.default;

  ora({
    text: 'Fetching abi...',
    spinner: cliSpinners.random,
  }).start();
}

module.exports = {
  showSpinner,
};
