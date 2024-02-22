const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');
const debug = require('common/src/debug');

let _enabled = true;
let _channelErrors = {};
let _activeChannels = {};
let _muted = false;

const _spinnies = new Spinnies({
  color: 'white',
  succeedColor: 'white',
  spinner: cliSpinners.dots,
});

function enable(value) {
  _enabled = value;
}

function mute(value) {
  _muted = value;
}

function progress(msg, channel = 'default') {
  if (_muted) return;
  if (_enabled === false) return debug.log(msg, 'spinner');

  _ensureSpinnie(channel);
  _spinnies.update(channel, { text: msg });
  _activeChannels[channel] = true;
}

function success(msg = 'Done', channel = 'default') {
  if (_muted) return;
  if (_enabled === false) return debug.log(msg, 'spinner');

  _ensureSpinnie(channel);
  _spinnies.succeed(channel, { text: msg });
  _activeChannels[channel] = false;
}

function fail(msg = 'Fail', channel = 'default') {
  if (_muted) return;
  if (_enabled === false) return debug.log(msg, 'spinner');

  const text = _appendChannelErrors(msg, channel);

  _ensureSpinnie(channel);
  _spinnies.fail(channel, { text });
}

function remove(channel = 'default') {
  _spinnies.remove(channel);
}

function stop() {
  Object.entries(_activeChannels).forEach(([channel, isActive]) => {
    if (isActive) {
      _spinnies.remove(channel);
      _activeChannels[channel] = false;
    }
  });
  _spinnies.stopAll();
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
  mute,
  progress,
  success,
  fail,
  remove,
  stop,
};
