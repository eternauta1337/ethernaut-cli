const chalk = require('chalk');
const boxen = require('boxen');
const debug = require('./debug');

let _collectingOutput = false;
let _output;

function resultBox(msg, title = 'Result') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'round',
    borderColor: 'blue',
  });
}

function infoBox(msg, title = 'Info') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'classic',
    borderColor: 'gray',
  });
}

function warnBox(msg, title = 'Warning') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
  });
}

function errorBox(error) {
  debug.log(error);
  box(error.stack, {
    title: 'Error',
    padding: 1,
    borderStyle: 'double',
    borderColor: 'red',
  });
}

function box(
  msg,
  { title, padding = 1, borderStyle = 'round', borderColor = 'blue' }
) {
  _out('');
  _out(
    boxen(msg, {
      title,
      padding,
      borderStyle,
      borderColor,
    })
  );
  _out('');
}

function info(msg) {
  _out(chalk.white(`i ${msg}`));
}

function warn(msg) {
  _out(chalk.yellow.bold(`! ${msg}`));
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
  resultBox,
  infoBox,
  warnBox,
  errorBox,
  info,
  warn,
  startCollectingOutput,
  stopCollectingOutput,
};
