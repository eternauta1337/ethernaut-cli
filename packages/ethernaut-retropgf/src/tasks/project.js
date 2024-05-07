const output = require('ethernaut-common/src/ui/output')
const similarity = require('string-similarity')
const types = require('ethernaut-common/src/validation/types')
const Agora = require('../internal/agora/Agora')
const { getLatestRound } = require('../internal/agora/utils/latest-round')

require('../scopes/retro')
  .task('project', 'Information about a particular RetroPGF project')
  .addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be "any" to query all rounds.',
    'latest',
    types.string,
  )
  .addPositionalParam('name', 'The project name to query')
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

async function getProjects(round) {
  const agora = new Agora()

  if (round === 'any') {
    return await agora.retro.projects()
  }

  if (round === 'latest') {
    return await agora.retro.roundProjects({
      roundId: await getLatestRound(),
    })
  }

  return await agora.retro.roundProjects({ roundId: round })
}
