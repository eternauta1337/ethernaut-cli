const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');

let _channelErrors = {};
const _spinnies = new Spinnies({ spinner: cliSpinners.random });

function progress(msg, channel = 'default') {
  _ensureSpinnie(channel);
  _spinnies.update(channel, { text: msg });
}

function success(msg = 'Done', channel = 'default') {
  _ensureSpinnie(channel);
  _spinnies.succeed(channel, { text: msg });
}

function fail(msg = 'Fail', channel = 'default') {
  const text = _appendChannelErrors(msg, channel);

  _ensureSpinnie(channel);
  _spinnies.fail(channel, { text });
}

function error(err, channel = 'default') {
  if (!_channelErrors[channel]) _channelErrors[channel] = [];
  _channelErrors[channel].push(err);
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
  progress,
  success,
  fail,
  error,
  remove,
  stop,
};
