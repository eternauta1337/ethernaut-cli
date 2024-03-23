const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { chains } = require('ethernaut-common/src/data/chains')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/util')
  .task('chain', 'Finds a network name from a chain ID, or vice versa')
  .addPositionalParam(
    'filter',
    'If a number, interprets it as a chain ID. If a string, interprets it as a network name',
    undefined,
    types.string,
  )
  .setAction(async ({ filter }) => {
    try {
      if (!isNaN(filter)) {
        return output.resultBox(getNetworkNameFromChainId(filter))
      } else {
        const candidates = getChainIdsFromNetworkName(filter)
        return output.resultBox(candidates.join('\n'))
      }
    } catch (err) {
      return output.errorBox(err)
    }
  })

function getChainIdsFromNetworkName(name) {
  const matches = chains.filter((c) =>
    c.name.toLowerCase().includes(name.toLowerCase()),
  )
  if (matches.length === 0) {
    throw new EthernautCliError(
      'ethernaut-util',
      `Cannot find network for name ${name}`,
      false,
    )
  }
  return matches.map((m) => `- ${m.name} (${m.chainId})`)
}

function getNetworkNameFromChainId(id) {
  const chain = chains.find((c) => c.chainId === Number(id))
  if (!chain) {
    throw new EthernautCliError(
      'ethernaut-util',
      `Cannot find network for chain ID ${id}`,
      false,
    )
  }
  return chain.name
}
