const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')

require('../scopes/oso')
  .task('list', 'Lists Open Source Observer projects')
  .addPositionalParam(
    'filter',
    'A keyword used to filter projects',
    '',
    types.string,
  )
  .addOptionalParam('limit', 'Number of projects to list', 10, types.int)
  .setAction(async ({ filter, limit }) => {
    try {
      const oso = new OpenSourceObserver()

      let projects = await oso.getProjects(filter, limit)

      let strs = []
      for (const project of projects) {
        strs.push(`- ${project.project_name} (${project.project_slug})`)
      }

      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
