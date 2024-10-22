const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const Projects = require('../internal/agora/Projects')
// const Agora = require('../internal/agora/Agora')
// const { getLatestRound } = require('../internal/agora/utils/latest-round')

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
    console.log('params: ', { round, name, category })

    try {
      let roundId
      if (round === 'latest')
        roundId = 5 // await getLatestRound()
      else if (round === 'any') roundId = undefined

      let projects = await getProjects(roundId)

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

async function getProjects(roundId) {
  const agora = new Projects()

  if (roundId === undefined) {
    return await agora.projects()
  }

  return await agora.roundProjects({ roundId })
}

// async function getProjects(roundId) {
//   const agora = new Agora()

//   if (roundId === 'any') {
//     return await agora.retro.projects()
//   }

//   return await agora.retro.roundProjects({ roundId })
// }
