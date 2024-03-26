const Spinnies = require('spinnies')
const cliSpinners = require('cli-spinners')
const debug = require('ethernaut-common/src/ui/debug')

let _enabled = true
let _activeChannels = {}
let _muted = false

const _spinnies = new Spinnies({
  color: 'white',
  succeedColor: 'white',
  spinner: cliSpinners.dots,
})

function enable(value) {
  _enabled = value
}

function mute(value) {
  _muted = value
}

function progress(msg, channel = 'default') {
  if (_muted) return
  if (_enabled === false) return debug.log(msg, 'spinner')

  _ensureSpinnie(channel)
  _activeChannels[channel] = true

  return _spinnies.update(channel, { text: msg })
}

function success(msg = 'Done', channel = 'default') {
  if (_muted) return
  if (_enabled === false) return debug.log(msg, 'spinner')

  _ensureSpinnie(channel)
  _activeChannels[channel] = false

  return _spinnies.succeed(channel, { text: msg })
}

function fail(msg = 'Fail', channel = 'default') {
  if (_muted) return
  if (_enabled === false) return debug.log(msg, 'spinner')

  _ensureSpinnie(channel)
  _spinnies.fail(channel, { text: msg })
}

function remove(channel = 'default') {
  _spinnies.remove(channel)
}

function stop() {
  Object.entries(_activeChannels).forEach(([channel, isActive]) => {
    if (isActive) {
      _spinnies.remove(channel)
      _activeChannels[channel] = false
    }
  })
  _spinnies.stopAll()
}

function _ensureSpinnie(channel) {
  if (!_spinnies.pick(channel)) {
    _spinnies.add(channel, { text: '' })
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
}
