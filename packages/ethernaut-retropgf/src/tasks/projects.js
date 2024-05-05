const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getProjects } = require('../internal/agora/utils/projects')

require('../scopes/retro')
  .task(
    'projects',
    'Prints a list of projects registered in RetroPGF applying specified filters',
  )
  .addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be "any" or a number > 0.',
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
