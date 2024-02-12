const chalk = require('chalk');

let _collectingOutput = false;
let _output;

function result(msg) {
  _out(chalk.blue(`> ${msg}`));
}

function info(msg) {
  _out(chalk.black(`i ${msg}`));
}

function warn(msg) {
  _out(chalk.yellow.bold(`! ${msg}`));
}

function problem(msg) {
  _out(chalk.red(msg));
}

function _out(msg) {
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
  warn,
  problem,
  startCollectingOutput,
  stopCollectingOutput,
};
