const chalk = require('chalk');
const boxen = require('boxen');

let _collectingOutput = false;
let _output;

function resultBox(msg, title = 'Result') {
  _out('');
  _out(
    boxen(msg, {
      title,
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue',
    })
  );
}

function infoBox(msg, title = 'Info') {
  _out('');
  _out(
    boxen(msg, {
      title,
      padding: 1,
      borderStyle: 'classic',
      borderColor: 'gray',
    })
  );
}

function warnBox(msg, title = 'Warning') {
  _out('');
  _out(
    boxen(msg, {
      title,
      padding: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
    })
  );
}

function errorBox(msg, title = 'Error') {
  _out('');
  _out(
    boxen(msg, {
      title,
      padding: 1,
      borderStyle: 'round',
      borderColor: 'red',
    })
  );
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
