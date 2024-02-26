const output = require('common/src/output')
const { execSync } = require('child_process')
const { isUrl } = require('common/src/url')
const storage = require('../internal/storage')

require('../scopes/net')
  .task('local', 'Starts a local chain')
  .addOptionalParam('fork', 'The alias or url of the network to fork')
  .setAction(async ({ fork }) => {
    try {
      const forkUrl = getForkUrl(fork)

      if (forkUrl) {
        output.info(`Starting local chain with fork ${forkUrl}...`)
      } else {
        output.info('Starting local chain...')
      }

      startAnvil(forkUrl)
    } catch (err) {
      return output.errorBox(err)
    }
  })

function getForkUrl(fork) {
  if (fork && fork !== '') {
    if (isUrl(fork)) {
      return fork
    } else {
      const networks = storage.readNetworks()
      const network = networks[fork]
      if (!network) {
        throw new Error(`Network ${fork} not found`)
      }
      return network.url
    }
  }
}

function startAnvil(forkUrl) {
  execSync('anvil --version', { stdio: 'inherit' })

  if (!forkUrl) {
    execSync('anvil', { stdio: 'inherit' })
  } else {
    execSync(`anvil --fork-url ${forkUrl}`, { stdio: 'inherit' })
  }
}
