const updateNotifier = require('update-notifier')
const { prompt, hidePrompts } = require('ethernaut-common/src/ui/prompt')
const { spawn } = require('child_process')
const storage = require('ethernaut-common/src/io/storage')
const { isRunningOnCiServer } = require('hardhat/internal/util/ci-detection')
const semver = require('semver')

const choices = {
  YES: 'Install this update',
  NO: 'No thanks',
  SKIP: 'Skip this update',
  // eslint-disable-next-line quotes
  NEVER: "Don't ask again",
}

module.exports = async function checkAutoUpdate(pkg) {
  console.log('u ALLOW_UPDATE', process.env.ALLOW_UPDATE)
  console.log('u CI', process.env.CI)
  console.log('u CONTINUOUS_INTEGRATION', process.env.CONTINUOUS_INTEGRATION)
  console.log('u BUILD_NUMBER', process.env.BUILD_NUMBER)
  console.log('u RUN_ID', process.env.RUN_ID)
  if (process.env.ALLOW_UPDATE !== 'true' && isRunningOnCiServer()) return
  console.log('u allowed')

  // Check if auto-update is disabled
  const config = storage.readConfig()

  // Check if there is an update
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 0,
  })
  notifier.notify()
  console.log('u update', notifier.update)

  // If there is an update
  if (notifier.update) {
    // This can happen sometimes due to the sync nature of update-notifier
    if (notifier.update.latest === pkg.version) {
      return
    }

    // And this
    if (!semver.gt(notifier.update.latest, notifier.update.current)) {
      return
    }

    notifyUpdate(notifier.update.latest)

    // Is the new version marked to be skipped?
    if (config.general.autoUpdate === notifier.update.latest) {
      return
    }

    // Has the user opted out of updates indefinitely?
    if (config.general.autoUpdate === 'never') {
      return
    }

    // Ask the user if they want to update
    await prompt({
      type: 'select',
      choices: Object.values(choices),
      message: `A new version of the ethernaut-cli is available (${notifier.update.current} > ${notifier.update.latest}), would you like to install it?`,
      callback: (response) => {
        switch (response) {
          case choices.YES:
            hidePrompts(true)
            install()
            break
          case choices.NO:
            // Do nothing
            break
          case choices.SKIP:
            // Mark this version to be skipped
            config.general.autoUpdate = notifier.update.latest
            storage.saveConfig(config)
            break
          case choices.NEVER:
            // Disable auto-update
            config.general.autoUpdate = 'never'
            storage.saveConfig(config)
            break
        }
      },
    })
  }
}

function notifyUpdate(version) {
  console.log(`v${version} is available, update with 'npm i -g ethernaut-cli'`)
}

function install() {
  console.log('Installing update...')

  const installProcess = spawn('npm', ['install', '-g', 'ethernaut-cli'])

  installProcess.stdout.on('data', (data) => {
    console.log(`${data}`)
  })

  installProcess.stderr.on('data', (data) => {
    console.error(`${data}`)
  })

  installProcess.on('error', (error) => {
    console.error(`Installation failed: ${error.message}`)
  })

  installProcess.on('close', () => {
    console.log(
      'Installation finished. Please restart the ethernaut-cli to apply the update.',
    )
    process.exit()
  })
}
