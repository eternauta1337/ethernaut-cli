const chalk = require('chalk');

let _collectingOutput = false;
let _output;

function result(...msgs) {
  _out(chalk.blue(_join(msgs)));
}

function info(...msgs) {
  _out(chalk.dim(_join(msgs)));
}

function problem(msg) {
  _out(chalk.red(msg));
}

function _join(msgs) {
  if (msgs === undefined) return;

  return msgs
    .map((m) => (typeof m === 'object' ? JSON.stringify(m, null, 2) : m))
    .join(' ');
}

function _out(...msgs) {
  const msg = _join(msgs);
  if (msg === undefined) return;

  _output += msg + '\n';
  console.log(msg);
}

function startCollectingOutput() {
  if (_collectingOutput) {
    error('Already collecting output');
  }

  _collectingOutput = true;

  _output = '';
}

function stopCollectingOutput() {
  if (!_collectingOutput) {
    error('Not collecting output');
  }

  _collectingOutput = false;

  return _output;
}

module.exports = {
  result,
  info,
  problem,
  startCollectingOutput,
  stopCollectingOutput,
};
