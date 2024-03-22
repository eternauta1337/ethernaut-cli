const storage = require('ethernaut-common/src/io/storage')
const prompt = require('ethernaut-common/src/ui/prompt')
const Sentry = require('@sentry/node')
const debug = require('ethernaut-common/src/ui/debug')
const { isRunningOnCiServer } = require('hardhat/internal/util/ci-detection')

let _consent
let _sentryInitialized

function queryTelemetryConsent() {
  if (isRunningOnCiServer()) {
    return
  }

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
  if (!_sentryInitialized) {
    initializeSentry()
  }

  if (error.shouldBeReported === false) {
    debug.log(
      'Error identified as EthernautCliError with shouldBeReported as false, skipping Sentry report',
      'telemetry',
    )
    return
  }

  debug.log(`Reporting error to Sentry: ${error}`, 'telemetry')

  Sentry.captureException(error)
}

function initializeSentry() {
  Sentry.init({
    dsn: 'https://9ff7d85abf829bad61aa468646e6bf0b@o4506955939184640.ingest.us.sentry.io/4506955942199296',
  })

  debug.log('Sentry initialized', 'telemetry')

  _sentryInitialized = true
}

module.exports = {
  queryTelemetryConsent,
  reportError,
  hasUserConsent,
}
