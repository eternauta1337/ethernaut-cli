const storage = require('ethernaut-common/src/io/storage')
const prompt = require('ethernaut-common/src/ui/prompt')

let _consent

function queryTelemetryConsent() {
  const config = storage.readConfig()

  if (!config.general) {
    config.general = {}
  }

  if (config.general.telemetryConsent === undefined) {
    prompt({
      type: 'confirm',
      message:
        'Help us improve ethernaut-cli by sending anonymous crash reports and basic usage data?',
      initial: true,
      callback: (response) => {
        _consent = response
        config.general.telemetryConsent = response
        storage.saveConfig(config)
      },
    })
  }
}

function hasUserConsent() {
  if (_consent !== undefined) {
    return _consent
  }

  const config = storage.readConfig()

  return (_consent = config.general.telemetryConsent)
}

function reportError(error) {
  console.log('>>>', error)
}

module.exports = {
  queryTelemetryConsent,
  reportError,
  hasUserConsent,
}
