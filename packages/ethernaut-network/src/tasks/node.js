const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { execSync } = require('child_process')
const { isUrl } = require('ethernaut-common/src/util/url')
const storage = require('../internal/storage')
const applyEnvVars = require('../internal/apply-env-vars')

const task = require('../scopes/network')
  .task('node', 'Starts a local development chain, potentially with a fork.')
  .addParam(
    'fork',
    'The alias or url of the network to fork',
    'none',
    types.string,
  )
  .addParam('port', 'The port to run the local chain on', 8545, types.int)
  .setAction(async ({ fork, port }) => {
    try {
      const forkUrl = await getForkUrl(fork)

      port = Number(port) || 8545

      if (forkUrl.url) {
        output.info(`Starting local chain with fork ${forkUrl.url}...`)
      } else {
        output.info('Starting local chain...')
      }

      startAnvil(forkUrl.unfoldedUrl, port)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function getForkUrl(fork) {
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

  urlInfo.unfoldedUrl = await applyEnvVars(urlInfo.url)

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

task.paramDefinitions.fork.isOptional = false
task.paramDefinitions.port.isOptional = false
