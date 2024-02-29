const { types } = require('hardhat/config')
const output = require('common/src/output')
const { execSync } = require('child_process')
const { isUrl } = require('common/src/url')
const storage = require('../internal/storage')
const autocompleteFork = require('./autocomplete/fork')
const applyEnvVars = require('../internal/apply-env-vars')

const local = require('../scopes/network')
  .task('node', 'Starts a local development chain, potentially with a fork.')
  .addOptionalParam(
    'fork',
    'The alias or url of the network to fork',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'port',
    'The port to run the local chain on',
    undefined,
    types.string,
  )
  .setAction(async ({ fork, port }) => {
    try {
      const forkUrl = getForkUrl(fork)

      port = Number(port) || 8545

      if (forkUrl) {
        output.info(`Starting local chain with fork ${forkUrl.url}...`)
      } else {
        output.info('Starting local chain...')
      }

      startAnvil(forkUrl.unfoldedUrl, port)
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

function startAnvil(forkUrl, port) {
  execSync('anvil --version', { stdio: 'inherit' })

  if (!forkUrl) {
    execSync(`anvil --port ${port}`, { stdio: 'inherit' })
  } else {
    execSync(`anvil --fork-url ${forkUrl} --port ${port}`, { stdio: 'inherit' })
  }
}

local.paramDefinitions.fork.autocomplete = autocompleteFork
