const { chains } = require('common/src/chains')
const prompt = require('common/src/prompt')

const strategies = {
  KNOWN: 'Known networks',
  MANUAL: 'Enter url manually',
}

module.exports = function setup(hre) {
  const add = hre.scopes.network.tasks.add

  add.paramDefinitions.url.autocomplete = autocompleteUrl
}

async function autocompleteUrl({ url }) {
  if (url) return undefined

  const choice = await selectStrategy()
  switch (choice) {
    case strategies.KNOWN:
      return await selectNetworkThenProvider()
    case strategies.MANUAL:
    // Do nothing
  }
}

async function selectStrategy() {
  const choices = Object.values(strategies)

  return await prompt({
    type: 'select',
    message: 'How would you like to specify a provider?',
    limit: 15,
    choices,
  })
}

async function selectNetworkThenProvider() {
  let choices = chains.map((c) => c.name)

  const networkName = await prompt({
    type: 'autocomplete',
    message: 'Select a network',
    limit: 15,
    choices,
  })

  const chain = chains.find((c) => c.name === networkName)
  choices = chain.rpc.filter((rpc) => !rpc.includes('wss'))

  return await prompt({
    type: 'autocomplete',
    message: 'Select a provider',
    limit: 15,
    choices,
  })
}
