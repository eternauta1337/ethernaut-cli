const updateNotifier = require('update-notifier')
const { prompt, cancelAllPrompts } = require('ethernaut-common/src/ui/prompt')
const { spawn } = require('child_process')
const storage = require('ethernaut-common/src/io/storage')
const { isRunningOnCiServer } = require('hardhat/internal/util/ci-detection')

const choices = {
  YES: 'Install this update',
  NO: 'No thanks',
  SKIP: 'Skip this update',
  NEVER: 'Never ask again',
}

module.exports = function checkAutoUpdate(pkg) {
  if (isRunningOnCiServer()) {
    return
  }

  // Check if auto-update is disabled
  const config = storage.readConfig()
  if (!config.general) {
    config.general = {}
  }
  if (config.general.autoUpdate !== undefined) {
    if (config.general.autoUpdate === 'never') {
      return
    }
  }

  // Check if there is an update
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 0,
  })
  notifier.notify()

  // If there is an update
  if (notifier.update) {
    if (notifier.update.latest === pkg.version) {
      return
    }

    // Is the new version marked to be skipped?
    if (config.general.autoUpdate === notifier.update.latest) {
      console.log(
        `v${notifier.update.latest} is available, update with 'npm i -g ethernaut-cli'`,
      )
      return
    }

    // Ask the user if they want to update
    prompt({
      type: 'select',
      choices: Object.values(choices),
      message: `A new version of the ethernaut-cli is available (${notifier.update.current} > ${notifier.update.latest}), would you like to install it?`,
      callback: (response) => {
        switch (response) {
          case choices.YES:
            cancelAllPrompts()
            install()
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
      'Installation successful. Please restart the ethernaut-cli to apply the update.',
    )
    process.exit()
  })
}
