const chalk = require('chalk');
const boxen = require('boxen');
const debug = require('./debug');

let _collectingOutput = false;
let _outputBuffer;
let _muted = false;

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

function copyBox(msg, title = 'Info') {
  box(chalk.cyan(msg), {
    title,
    padding: 0,
    borderColor: 'cyan',
    borderStyle: {
      topLeft: '+',
      topRight: '+',
      bottomLeft: '+',
      bottomRight: '+',
      horizontal: '-',
      vertical: ' ',
    },
  });
}

function box(
  msg,
  { title, padding = 1, borderStyle = 'round', borderColor = 'blue' }
) {
  _collect(msg);
  _out(
    boxen(msg, {
      title,
      padding,
      borderStyle,
      borderColor,
    })
  );
}

function info(msg) {
  _collect(msg);
  _out(chalk.white(`i ${msg}`));
}

function warn(msg) {
  _collect(msg);
  _out(chalk.yellow.bold(`! ${msg}`));
}

function _out(msg) {
  if (_muted) return;
  console.log(msg);
}

function _collect(msg) {
  if (msg === undefined) return;
  if (!_collectingOutput) return;

  _outputBuffer.content += msg + '\n';
}

function startCollectingOutput(buffer = { content: '' }) {
  if (_collectingOutput) {
    error('Already collecting output');
  }

  _collectingOutput = true;

  _outputBuffer = buffer;
}

function stopCollectingOutput() {
  if (!_collectingOutput) {
    error('Not collecting output');
  }

  const content = _outputBuffer.content;

  _collectingOutput = false;
  _outputBuffer.content = '';
  _outputBuffer = undefined;

  return content;
}

function mute(value) {
  _muted = value;
}

module.exports = {
  resultBox,
  infoBox,
  warnBox,
  errorBox,
  copyBox,
  info,
  warn,
  startCollectingOutput,
  stopCollectingOutput,
  mute,
};
