const chalk = require('chalk');

let _collectingOutput = false;
let _output;
let _boxen;

function result(msg) {
  _out(chalk.blue(`> ${msg}`));
}

function resultBox(title, msgs) {
  _out(_boxen(msgs.join('\n'), { title, padding: 1, borderStyle: 'double' }));
}

function info(msg) {
  _out(chalk.white(`i ${msg}`));
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

async function init() {
  _boxen = (await import('boxen')).default;
}

module.exports = {
  init,
  result,
  resultBox,
  info,
  warn,
  problem,
  startCollectingOutput,
  stopCollectingOutput,
};
