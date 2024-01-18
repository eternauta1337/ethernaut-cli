const cliSpinners = require('cli-spinners');

let spinner;

async function show(text) {
  const module = await import('ora');
  const ora = module.default;

  spinner = ora({
    text,
    spinner: cliSpinners.random,
  }).start();
}

async function stop(text) {
  spinner.stopAndPersist({
    prefixText: '✔',
    text,
  });
}

async function hide() {
  spinner.stop();
}

module.exports = {
  show,
  hide,
  stop,
};
