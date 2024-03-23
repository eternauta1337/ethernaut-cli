const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const similarity = require('string-similarity')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/interact')
  .task(
    'find-abi',
    'Given part of a name of an abi, displays a list with the absolute paths of known local ABI files',
  )
  .addPositionalParam(
    'filter',
    'Some text to filter the list of known ABIs. Leave empty to list all. Results will be ordered by similarity to the filter text, so the first result will be the best match.',
    undefined,
    types.string,
  )
  .setAction(async ({ filter }) => {
    try {
      let abis = storage.readAbiFiles()

      if (filter !== undefined) {
        filter = filter.toLowerCase()
        abis = abis.filter((a) => a.name.toLowerCase().includes(filter))
        if (abis.length === 0) {
          throw new EthernautCliError('ethernaut-interact', 'No ABIs found')
        }

        const matches = similarity.findBestMatch(
          filter,
          abis.map((a) => a.name.toLowerCase()),
        )

        abis.sort((a, b) => {
          const matchA = matches.ratings.find(
            (match) => match.target === a.name.toLowerCase(),
          )
          const matchB = matches.ratings.find(
            (match) => match.target === b.name.toLowerCase(),
          )
          return matchB.rating - matchA.rating
        })
      }

      if (abis.length === 0) {
        throw new EthernautCliError('ethernaut-interact', 'No ABIs found')
      }

      const paths = abis.map((a) => a.path)

      return output.resultBox(paths.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
