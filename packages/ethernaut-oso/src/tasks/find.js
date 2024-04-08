const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')

require('../scopes/metrics')
  .task(
    'find',
    'Finds Open Source Observer projects by keyword, listing matches by name and slug',
  )
  .addPositionalParam(
    'filter',
    'A keyword used to filter projects',
    undefined,
    types.string,
  )
  .addOptionalParam('limit', 'Number of projects to list', 10, types.int)
  .setAction(async ({ filter, limit }) => {
    try {
      const oso = new OpenSourceObserver()

      const projects = await oso.getProjects(filter, limit)

      if (projects.length === 0) {
        throw new Error(`No projects found for "${filter}"`)
      }

      let strs = []
      for (const project of projects) {
        strs.push(`- ${project.project_name} (${project.project_slug})`)
      }

      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
