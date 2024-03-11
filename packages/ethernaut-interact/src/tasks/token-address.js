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
  .setAction(async ({ name }, hre) => {
    try {
      // Id network
      const network = (await hre.ethers.provider.getNetwork()).toJSON()
      const chainId = Number(network.chainId)
      const chainInfo = chains.find((c) => c.chainId === chainId)

      // Filter candidates by network
      const candidates = tokens.filter((t) => {
        if (t.chainId !== chainId) return false

        const nameMatch = t.name.includes(name)
        const symbolMatch = t.symbol.includes(name)

        return nameMatch || symbolMatch
      })

      const nameMatches = similarity.findBestMatch(
        name,
        candidates.map((c) => c.name),
      )
      const symbolMatches = similarity.findBestMatch(
        name,
        candidates.map((c) => c.symbol),
      )

      if (!nameMatches && !symbolMatches) {
        throw new Error(`Cannot find token info for ${name}`)
      }

      let match

      if (nameMatches && !symbolMatches) {
        match = candidates.find((c) => c.name === nameMatches.bestMatch.target)
      } else if (!nameMatches && symbolMatches) {
        match = candidates.find(
          (c) => c.symbol === symbolMatches.bestMatch.target,
        )
      } else {
        if (nameMatches.bestMatch.rating > symbolMatches.bestMatch.rating) {
          match = candidates.find(
            (c) => c.name === nameMatches.bestMatch.target,
          )
        } else {
          match = candidates.find(
            (c) => c.symbol === symbolMatches.bestMatch.target,
          )
        }
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
