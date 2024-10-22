const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const Agora = require('../internal/agora/Agora')

require('../scopes/optigov')
  .task(
    'projects',
    'Prints a list of projects registered in RetroPGF, given specified filters',
  )
  .addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be "any" to query all rounds.',
    'latest',
    types.string,
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
      const agora = new Agora()

      let roundId
      if (round === 'latest') roundId = agora.projects.getLatestRound()
      else if (round === 'any') roundId = undefined

      let projects = await getProjects(agora, roundId)

      projects = filterProjects(projects, name, category)

      return output.resultBox(printProjects(projects), 'Projects')
    } catch (err) {
      return output.errorBox(err)
    }
  })

function filterProjects(projects, name, category) {
  const nameLower = name?.toLowerCase()
  const categoryLower = category?.toLowerCase()

  return projects.filter((p) => {
    // Filter by name if it's provided
    const matchesName = nameLower
      ? p.name.toLowerCase().includes(nameLower)
      : true

    // Filter by category if it's provided
    const matchesCategory = categoryLower
      ? p.category.toLowerCase() === categoryLower
      : true

    return matchesName && matchesCategory
  })
}

function printProjects(projects) {
  const strs = []

  for (const project of projects) {
    strs.push(` - ${project.name}: ${project.category}: ${project.description}`)
  }

  return strs.join('\n\n')
}

async function getProjects(agora, roundId) {
  if (roundId === undefined) {
    return await agora.projects.projects()
  }

  return await agora.projects.roundProjects({ roundId })
}
