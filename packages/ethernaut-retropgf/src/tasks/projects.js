const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const Agora = require('../internal/agora/Agora')

require('../scopes/retro')
  .task(
    'projects',
    'Prints a list of projects registered in RetroPGF applying specified filters',
  )
  .addParam(
    'round',
    'The round number to query. Defaults to 0, which is the latest round. If set to -1, all rounds will be queried.',
    0,
    types.int,
  )
  .addOptionalParam(
    'name',
    'A filter to apply to the project names',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'category',
    'A filter to apply to the project category',
    undefined,
    types.string,
  )
  .setAction(async ({ round, name, category }) => {
    try {
      let projects = await getProjects(round)

      projects = filterProjects(projects, name, category)

      return output.resultBox(printProjects(projects), 'Projects')
    } catch (err) {
      return output.errorBox(err)
    }
  })

function filterProjects(projects, name, category) {
  if (name) {
    projects = projects.filter((p) => {
      return p.name.toLowerCase().includes(name.toLowerCase())
    })
  }

  if (category) {
    projects = projects.filter((p) => {
      const categoryNames = p.categories.map((c) => c.name.toLowerCase())
      return categoryNames.includes(category.toLowerCase())
    })
  }

  return projects
}

function printProjects(projects) {
  const strs = []

  for (const project of projects) {
    strs.push(`- ${project.name} (${project.description})`)
  }

  return strs.join('\n')
}

async function getProjects(round) {
  let projects

  const agora = new Agora()

  if (round === '-1') {
    // Any round
    projects = await agora.retro.projects()
  } else if (round >= 0) {
    if (round === 0) {
      // Latest round
      const latestRound = 3
      projects = await agora.retro.roundProjects({ roundId: latestRound })
    } else {
      // Specified round
      projects = await agora.retro.roundProjects({ roundId: round })
    }
  }

  return projects
}
