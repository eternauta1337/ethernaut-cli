const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { chains } = require('ethernaut-common/src/data/chains')
const { tokens } = require('ethernaut-common/src/data/tokens')
const similarity = require('string-similarity')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/util')
  .task(
    'token',
    'Tries to find the address of a token, given a filter that represents its name or symbol in the current network or the specified chain id. A list of possible matches is shown, sorted by rating. You can control how many results are shown with the results option.',
  )
  .addPositionalParam(
    'filter',
    'A filter used to search for the token',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'chain',
    'The name or id of the network to search on. Use "0" to only search on the current network. Use "-1" to search on any network. Default is "-1" (any network)',
    '-1',
    types.string,
  )
  .addOptionalParam('results', 'The number of results to show', 5, types.int)
  .setAction(async ({ filter, chain, results }, hre) => {
    try {
      const chainInfo = await identifyNetwork(chain, hre)

      let candidates = tokens

      // Filter candidates by network?
      if (chainInfo.chainId > 0) {
        candidates = tokens.filter((t) => t.chainId === chainInfo.chainId)
        if (!candidates || candidates.length === 0) {
          throw new EthernautCliError(
            'ethernaut-util',
            `Cannot find token info for ${filter}`,
            false,
          )
        }
      }

      // Search name and symbol independently
      const nameMatches = similarity.findBestMatch(
        filter.toLowerCase(),
        candidates.map((c) => c.name.toLowerCase()),
      )
      const symbolMatches = similarity.findBestMatch(
        filter.toLowerCase(),
        candidates.map((c) => c.symbol.toLowerCase()),
      )
      if (!nameMatches && !symbolMatches) {
        throw new EthernautCliError(
          'ethernaut-util',
          `Cannot find token info for ${filter}`,
          false,
        )
      }

      // Sort by rating and add the associated candidate
      nameMatches.ratings
        .sort((a, b) => b.rating - a.rating)
        .map((m) => {
          m.type = 'name'
          m.candidate = candidates.find(
            (c) => c.name.toLowerCase() === m.target,
          )
        })
      symbolMatches.ratings
        .sort((a, b) => b.rating - a.rating)
        .map((m) => {
          m.type = 'symbol'
          m.candidate = candidates.find(
            (c) => c.symbol.toLowerCase() === m.target,
          )
        })

      // Combine the results, remove duplicates, and sort again
      let matches = [...nameMatches.ratings, ...symbolMatches.ratings]
      matches.sort((a, b) => b.rating - a.rating)
      const dedupedMatches = []
      const seenCandidates = new Set()
      for (const match of matches) {
        if (!seenCandidates.has(match.candidate)) {
          dedupedMatches.push(match)
          seenCandidates.add(match.candidate)
        }
      }
      matches = dedupedMatches.slice(0, results)

      // Translate chainId to network name
      console.log(chainInfo)
      if (chainInfo.name !== 'Any network' && chainInfo.name === undefined) {
        const tokenChain = chains.find((c) => c.chainId === chain)
        chainInfo.name = tokenChain.name
      }

      // Print results
      let str = ''
      str += `Found ${matches.length} matches for "${filter}" on ${chainInfo.name}:\n\n`
      const strs = []
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i]
        const c = match.candidate
        const chain = chains.find((c) => c.chainId === match.candidate.chainId)
        strs.push(
          `${i}. ${c.name} (${c.symbol}) Address: ${c.address} in ${chain.name} (Rating: ${match.rating})`,
        )
      }
      str += strs.join('\n')
      return output.resultBox(str)
    } catch (error) {
      return output.errorBox(error)
    }
  })

async function identifyNetwork(chain, hre) {
  const isNumber = !isNaN(chain)

  // -1 means any network, 0 means current network, 1+ means chainId
  if (isNumber) {
    const chainId = Number(chain)
    if (chainId === 0) {
      const network = (await hre.ethers.provider.getNetwork()).toJSON()
      return {
        chainId: Number(network.chainId),
        name: chains.find((c) => c.chainId === Number(network.chainId)).name,
      }
    } else if (chainId > 0) {
      return {
        chainId,
        name: chains.find((c) => c.chainId === chainId).name,
      }
    } else {
      return {
        chainId: -1,
        name: 'Any network',
      }
    }
  } else {
    // Translate network name to chainId
    const chainInfo = chains.find(
      (c) => c.name.toLowerCase() === chain.toLowerCase(),
    )
    if (!chainInfo) {
      throw new EthernautCliError(
        'ethernaut-util',
        `Cannot find network ${chain}`,
      )
    }
    return {
      chainId: chainInfo.chainId,
      name: chainInfo.name,
    }
  }
}
