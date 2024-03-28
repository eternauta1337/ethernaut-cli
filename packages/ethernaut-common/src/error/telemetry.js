const storage = require('ethernaut-common/src/io/storage')
const { prompt } = require('ethernaut-common/src/ui/prompt')
const Sentry = require('@sentry/node')
const debug = require('ethernaut-common/src/ui/debug')
const { isRunningOnCiServer } = require('hardhat/internal/util/ci-detection')
const EthernautCliError = require('../error/error')

let _consent
let _sentryInitialized

async function queryTelemetryConsent() {
  console.log('t >>> ALLOW_TELEMETRY', process.env.ALLOW_TELEMETRY)
  console.log('t >>> ALLOW_UPDATE', process.env.ALLOW_UPDATE)
  if (isRunningOnCiServer() && !process.env.ALLOW_TELEMETRY) {
    return
  }

  const config = storage.readConfig()

  if (config.general.telemetryConsent === undefined) {
    await prompt({
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
  if (isRunningOnCiServer()) {
    return false
  }

  if (_consent !== undefined) {
    return _consent
  }

  const config = storage.readConfig()

  return (_consent = config.general?.telemetryConsent)
}

function reportError(error) {
  if (isRunningOnCiServer()) {
    return
  }

  if (!_sentryInitialized) {
    initializeSentry()
  }

  // Ethernaut CLI specific errors marked not to be reported are ignored,
  // But all other errors are reported to Sentry
  if (error instanceof EthernautCliError && error.shouldBeReported === false) {
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
