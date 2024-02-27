const output = require('common/src/output')
const { execSync } = require('child_process')
const { isUrl } = require('common/src/url')
const storage = require('../internal/storage')
const autocompleteFork = require('./autocomplete/fork')
const applyEnvVars = require('../internal/apply-env-vars')

const local = require('../scopes/net')
  .task('local', 'Starts a local chain')
  .addOptionalParam('fork', 'The alias or url of the network to fork')
  .setAction(async ({ fork }) => {
    try {
      const forkUrl = getForkUrl(fork)

      if (forkUrl) {
        output.info(`Starting local chain with fork ${forkUrl.url}...`)
      } else {
        output.info('Starting local chain...')
      }

      startAnvil(forkUrl.unfoldedUrl)
    } catch (err) {
      return output.errorBox(err)
    }
  })

function getForkUrl(fork) {
  if (!fork || fork === 'none')
    return { url: undefined, unfoldedUrl: undefined }

  let urlInfo = {
    url: fork,
    unfoldedUrl: fork,
  }

  if (!isUrl(fork)) {
    const networks = storage.readNetworks()
    const network = networks[fork]
    if (!network) {
      throw new Error(`Network ${fork} not found`)
    }
    urlInfo.url = network.url
  }

  urlInfo.unfoldedUrl = applyEnvVars(urlInfo.url)

  return urlInfo
}

function startAnvil(forkUrl) {
  execSync('anvil --version', { stdio: 'inherit' })

  if (!forkUrl) {
    execSync('anvil', { stdio: 'inherit' })
  } else {
    execSync(`anvil --fork-url ${forkUrl}`, { stdio: 'inherit' })
  }
}

local.paramDefinitions.fork.autocomplete = autocompleteFork
