const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Strs = require('ethernaut-common/src/ui/strs')

require('../scopes/metrics')
  .task(
    'code',
    'Prints Open Source Observer code metrics for a project, including number of Github stars, commits, contributors, and more',
  )
  .addOptionalParam(
    'project',
    'The name or slug of the project',
    undefined,
    types.string,
  )
  .addOptionalParam('limit', 'Number of projects to list', 10, types.int)
  .addOptionalParam(
    'sort',
    `Sort by field. One of: ${OpenSourceObserver.getCodeMetricsFields().join(', ')}`,
    undefined,
    types.string,
  )
  .setAction(async ({ project, limit, sort }) => {
    try {
      const oso = new OpenSourceObserver()

      const projects = await oso.getCodeMetrics(project, limit, sort)

      if (projects.length === 0) {
        throw new EthernautCliError(
          'ethernaut-oso',
          `No projects found for "${project}"`,
        )
      }

      const buffer = []
      for (let idx = 0; idx < projects.length; idx++) {
        const project = projects[idx]
        const strs = new Strs(project)
        strs.pushAll(OpenSourceObserver.getCodeMetricsFields())
        const str = strs.print()
        output.resultBox(str, `Result ${idx + 1} of ${projects.length}`)
        buffer.push(str)
      }

      return buffer
    } catch (err) {
      return output.errorBox(err)
    }
  })
