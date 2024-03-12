const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const { chains } = require('ethernaut-common/src/chains')
const { tokens } = require('ethernaut-common/src/tokens')
const similarity = require('string-similarity')

require('../scopes/interact')
  .task(
    'token-address',
    'Tries to find the address of a token, given its name or symbol in the current network',
  )
  .addPositionalParam(
    'name',
    'The name or symbol of the token',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'chain',
    'The name or id of the network to search on. Use "0" to only search on the current network. Use "-1" to search on any network. Default is "0" (current network)',
    '0',
    types.string,
  )
  .setAction(async ({ name, chain }, hre) => {
    try {
      const chainInfo = await identifyNetwork(chain, hre)

      let candidates = tokens

      // Filter candidates by network?
      if (chainInfo.chainId > 0) {
        candidates = tokens.filter((t) => t.chainId === chainInfo.chainId)
        if (!candidates || candidates.length === 0) {
          throw new Error(`Cannot find token info for ${name}`)
        }
      }

      const nameMatches = similarity.findBestMatch(
        name.toLowerCase(),
        candidates.map((c) => c.name.toLowerCase()),
      )
      const symbolMatches = similarity.findBestMatch(
        name.toLowerCase(),
        candidates.map((c) => c.symbol.toLowerCase()),
      )

      if (!nameMatches && !symbolMatches) {
        throw new Error(`Cannot find token info for ${name}`)
      }

      let match

      if (nameMatches && !symbolMatches) {
        match = candidates.find(
          (c) => c.name.toLowerCase() === nameMatches.bestMatch.target,
        )
      } else if (!nameMatches && symbolMatches) {
        match = candidates.find(
          (c) => c.symbol.toLowerCase() === symbolMatches.bestMatch.target,
        )
      } else {
        if (nameMatches.bestMatch.rating > symbolMatches.bestMatch.rating) {
          match = candidates.find(
            (c) => c.name.toLowerCase() === nameMatches.bestMatch.target,
          )
        } else {
          match = candidates.find(
            (c) => c.symbol.toLowerCase() === symbolMatches.bestMatch.target,
          )
        }
      }

      if (chainInfo.name === 'Any network') {
        const tokenChain = chains.find((c) => c.chainId === match.chainId)
        chainInfo.name = tokenChain.name
      }

      let str = ''

      str += `Token name: ${name}\n`
      str += `Network: ${chainInfo.name}\n`
      str += `Symbol: ${match.symbol}\n`
      str += `Address: ${match.address}`

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
      throw new Error(`Cannot find network ${chain}`)
    }
    return {
      chainId: chainInfo.chainId,
      name: chainInfo.name,
    }
  }
}
