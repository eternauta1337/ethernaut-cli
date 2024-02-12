const chalk = require('chalk');
const boxen = require('boxen');

let _collectingOutput = false;
let _output;

function result(msg) {
  _out(chalk.blue(`> ${msg}`));
}

function resultBox({
  title,
  msgs,
  padding = 1,
  borderStyle = 'double',
  borderColor = 'green',
}) {
  _out('');
  _out(boxen(msgs.join('\n'), { title, padding, borderStyle, borderColor }));
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

module.exports = {
  result,
  resultBox,
  info,
  warn,
  problem,
  startCollectingOutput,
  stopCollectingOutput,
};
