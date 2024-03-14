const { types } = require('hardhat/config')
const output = require('ethernaut-common/src/output')
const storage = require('../internal/storage')
const similarity = require('string-similarity')

require('../scopes/interact')
  .task(
    'abi',
    'Looks for the absolute path to a known json file specifying the ABI of a contract.',
  )
  .addPositionalParam(
    'name',
    'A name to be used to find the ABI',
    undefined,
    types.string,
  )
  .setAction(async ({ name }) => {
    try {
      const abis = storage.readAbiFiles()

      const matches = similarity.findBestMatch(
        name.toLowerCase(),
        abis.map((a) => a.name.toLowerCase()),
      )

      if (!matches.bestMatch) {
        throw new Error(`Cannot find ABI for ${name}`)
      }

      const match = abis.find(
        (a) => a.name.toLowerCase() === matches.bestMatch.target,
      )

      return output.resultBox(
        `Found an ABI path that might match the name "${name}" at "${match.path}"`,
      )
    } catch (err) {
      return output.errorBox(err)
    }
  })
