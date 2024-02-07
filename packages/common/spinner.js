const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');

let _enabled = true;
let _channelErrors = {};
const _spinnies = new Spinnies({ spinner: cliSpinners.random });

function progress(msg, channel = 'default') {
  if (!_enabled) {
    console.log(msg);
    return;
  }

  _ensureSpinnie(channel);
  _spinnies.update(channel, { text: msg });
}

function progressSuccess(msg = 'Done', channel = 'default') {
  if (!_enabled) {
    console.log(msg);
    return;
  }

  _ensureSpinnie(channel);
  _spinnies.succeed(channel, { text: msg });
}

function progressFail(msg = 'Fail', channel = 'default') {
  const text = _appendChannelErrors(msg, channel);

  if (!_enabled) {
    console.log(text);
    return;
  }

  _ensureSpinnie(channel);
  _spinnies.fail(channel, { text });

  process.exit(1);
}

function progressError(err, channel = 'default') {
  if (!_enabled) {
    console.log(err);
    return;
  }

  if (!_channelErrors[channel]) _channelErrors[channel] = [];
  _channelErrors[channel].push(err);
}

function progressRemove(channel = 'default') {
  _spinnies.remove(channel);
}

function progressStopAll() {
  _spinnies.stopAll();
}

function enable(value) {
  _enabled = value;
}

function _appendChannelErrors(msg, channel) {
  const errors = _channelErrors[channel];
  if (!errors) return msg;

  return `${msg} ${errors.join('\n')}`;
}

function _ensureSpinnie(channel) {
  if (!_spinnies.pick(channel)) {
    _spinnies.add(channel, { text: '' });
  }
}

module.exports = {
  enable,
  progress,
  progressSuccess,
  progressFail,
  progressError,
  progressRemove,
  progressStopAll,
};
