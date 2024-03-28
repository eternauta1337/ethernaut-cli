const { checkUpdate } = require('ethernaut-common/src/util/update')
const { prompt, hidePrompts } = require('ethernaut-common/src/ui/prompt')
const { spawn } = require('child_process')
const storage = require('ethernaut-common/src/io/storage')
const { isRunningOnCiServer } = require('hardhat/internal/util/ci-detection')

const choices = {
  YES: 'Install this update',
  NO: 'No thanks',
  SKIP: 'Skip this update',
  // eslint-disable-next-line quotes
  NEVER: "Don't ask again",
}

module.exports = async function checkAutoUpdate(pkg) {
  if (process.env.ALLOW_UPDATE !== 'true' && isRunningOnCiServer()) return

  // Check if auto-update is disabled
  const config = storage.readConfig()

  // Check if there is an update
  const updateVersion = checkUpdate(pkg)

  // If there is an update
  if (updateVersion !== undefined) {
    notifyUpdate(updateVersion)

    // Is the new version marked to be skipped?
    if (config.general.autoUpdate === updateVersion) {
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
      message: `A new version of the ethernaut-cli is available (${pkg.version} > ${updateVersion}), would you like to install it?`,
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
            config.general.autoUpdate = updateVersion
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
