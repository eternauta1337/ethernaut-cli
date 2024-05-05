const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const similarity = require('string-similarity')
const { getProjects } = require('../internal/agora/utils/projects')

require('../scopes/retro')
  .task('project', 'Information about a particular RetroPGF project')
  .addPositionalParam('name', 'The project name to query')
  .addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be "any" or a number > 0.',
    'latest',
    types.string,
  )
  .setAction(async ({ name, round }) => {
    try {
      let projects = await getProjects(round)

      const matches = similarity.findBestMatch(
        name,
        projects.map((p) => p.name),
      )

      if (!matches) {
        return output.resultBox('No project found')
      }

      const match = projects.find((p) => p.name === matches.bestMatch.target)

      return output.resultBox(JSON.stringify(match, null, 2))
    } catch (err) {
      return output.errorBox(err)
    }
  })
