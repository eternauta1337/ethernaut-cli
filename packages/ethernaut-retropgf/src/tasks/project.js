const Agora = require('../internal/agora/Agora')
const output = require('ethernaut-common/src/ui/output')
const similarity = require('string-similarity')

require('../scopes/retro')
  .task('project', 'Information about a particular RetroPGF project')
  .addPositionalParam('name', 'The project name to query')
  .setAction(async ({ name }) => {
    try {
      let projects = await getProjects()

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

async function getProjects() {
  const agora = new Agora()

  return agora.retro.projects()
}
