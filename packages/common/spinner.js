const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');
const debug = require('common/debug');

let _enabled = true;
let _channelErrors = {};
const _spinnies = new Spinnies({
  color: 'white',
  succeedColor: 'white',
  spinner: cliSpinners.dots,
});

function enable(value) {
  _enabled = value;
}

function progress(msg, channel = 'default') {
  if (!_enabled) return debug.log(msg, 'spinner');

  _ensureSpinnie(channel);
  _spinnies.update(channel, { text: msg });
}

function success(msg = 'Done', channel = 'default') {
  if (!_enabled) return debug.log(msg, 'spinner');

  _ensureSpinnie(channel);
  _spinnies.succeed(channel, { text: msg });
}

function fail(msg = 'Fail', channel = 'default') {
  if (!_enabled) return debug.log(msg, 'spinner');

  const text = _appendChannelErrors(msg, channel);

  _ensureSpinnie(channel);
  _spinnies.fail(channel, { text });
}

function remove(channel = 'default') {
  _spinnies.remove(channel);
}

function stop() {
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
  progress,
  success,
  fail,
  remove,
  stop,
};
