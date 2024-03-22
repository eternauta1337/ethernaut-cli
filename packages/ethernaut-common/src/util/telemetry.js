const storage = require('ethernaut-common/src/io/storage')
const prompt = require('ethernaut-common/src/ui/prompt')

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
        config.general.telemetryConsent = response
        storage.saveConfig(config)
      },
    })
  }
}

module.exports = {
  queryTelemetryConsent,
}
