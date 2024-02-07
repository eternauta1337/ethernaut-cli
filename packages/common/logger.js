const chalk = require('chalk');
const path = require('path');
const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');
const debugLib = require('debug');

const PREFIX = 'hardhat:ethernaut';
const _debug = debugLib(PREFIX);
let _verbose = false;
let _collectingOutput = false;
let _output;
let _channelErrors = {};
const _spinnies = new Spinnies({ spinner: cliSpinners.random });

function output(...msgs) {
  _out(chalk.blue(_join(msgs)));
}

function info(...msgs) {
  _out(chalk.dim(_join(msgs)));
}

function _ensureSpinnie(channel) {
  if (!_spinnies.pick(channel)) {
    _spinnies.add(channel, { text: '' });
  }
}

function progress(msg, channel = 'default') {
  if (_verbose) {
    _out(msg);
    return;
  }

  _ensureSpinnie(channel);
  _spinnies.update(channel, { text: msg });
}

function progressRemove(channel = 'default') {
  _spinnies.remove(channel);
}

function progressSuccess(msg = 'Done', channel = 'default') {
  if (_verbose) {
    _out(msg);
    return;
  }

  _ensureSpinnie(channel);
  _spinnies.succeed(channel, { text: msg });
}

function progressFail(msg = 'Fail', channel = 'default') {
  const text = `${msg}${
    _channelErrors[channel] ? `\n${_channelErrors[channel].join('\n')}` : ''
  }`;
  _channelErrors[channel] = [];

  if (_verbose) {
    error(text);
  }

  _ensureSpinnie(channel);
  _spinnies.fail(channel, { text });

  process.exit(1);
}

function progressError(err, channel = 'default') {
  if (_verbose) {
    error(err);
  }

  if (!_channelErrors[channel]) _channelErrors[channel] = [];
  _channelErrors[channel].push(err);
}

function progressStopAll() {
  _spinnies.stopAll();
}

function debug(...msgs) {
  if (!_verbose) return;

  _out(`[${_getCallerFile()}]`, _join(msgs));
}

function error(error) {
  if (_verbose) {
    _out(`[${_getCallerFile()}]`, error);
  } else {
    _out(chalk.red(error.message));
  }

  process.exit(1);
}

function _join(msgs) {
  return msgs
    .map((m) => (typeof m === 'object' ? JSON.stringify(m, null, 2) : m))
    .join(' ');
}

function _out(...msgs) {
  const msg = _join(msgs);

  _output += msg + '\n';

  if (_verbose) {
    _debug(msg);
  } else {
    console.log(msg);
  }
}

function setVerbose(value) {
  _verbose = value;
}

function getVerbose() {
  return _verbose;
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

const _getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerfile;
  try {
    const err = new Error();
    let currentfile;

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile ? path.basename(callerfile) : undefined;
};

module.exports = {
  output,
  debug,
  error,
  info,
  progress,
  progressSuccess,
  progressFail,
  progressError,
  progressRemove,
  progressStopAll,
  setVerbose,
  getVerbose,
  startCollectingOutput,
  stopCollectingOutput,
};
