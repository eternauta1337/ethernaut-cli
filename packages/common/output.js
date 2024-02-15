const chalk = require('chalk');
const boxen = require('boxen');
const debug = require('./debug');

let _muted = false;

function resultBox(msg, title = 'Result') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'round',
    borderColor: 'blue',
  });

  return msg;
}

function infoBox(msg, title = 'Info') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'classic',
    borderColor: 'gray',
  });

  return msg;
}

function warnBox(msg, title = 'Warning') {
  box(msg, {
    title,
    padding: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
  });

  return msg;
}

function errorBox(error) {
  debug.log(error);

  box(error.stack, {
    title: 'Error',
    padding: 1,
    borderStyle: 'double',
    borderColor: 'red',
  });

  return error.message;
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

  return msg;
}

function box(
  msg,
  { title, padding = 1, borderStyle = 'round', borderColor = 'blue' }
) {
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
  _out(chalk.white(`i ${msg}`));

  return msg;
}

function warn(msg) {
  _out(chalk.yellow.bold(`! ${msg}`));

  return msg;
}

function _out(msg) {
  if (_muted) return;
  console.log(msg);
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
  mute,
};
