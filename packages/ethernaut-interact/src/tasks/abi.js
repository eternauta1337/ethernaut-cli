const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const storage = require('../internal/storage')
const similarity = require('string-similarity')

require('../scopes/interact')
  .task('abi', 'Prints out the absolute paths of the known ABIs')
  .addPositionalParam(
    'filter',
    'Some text to filter the list of known ABIs. Leave empty to list all. Results will be ordered by similarity to the filter text, so the first result will be the best match.',
    undefined,
    types.string,
  )
  .setAction(async ({ filter }) => {
    try {
      let abis = storage.readAbiFiles()

      if (filter) {
        filter = filter.toLowerCase()
        abis = abis.filter((a) => a.name.toLowerCase().includes(filter))
      }

      if (abis.length === 0) {
        throw new Error('No ABIs found')
      }

      const matches = similarity.findBestMatch(
        filter.toLowerCase(),
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

      const paths = abis.map((a) => a.path)

      return output.resultBox(paths.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
